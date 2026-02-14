import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bell, Trash2, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Reminder = {
  id: string;
  medicineName: string;
  time: string;
  note?: string;
  timestamp: any;
};

const MedicineReminders = ({ isExpanded }: { isExpanded: boolean }) => {
  const { user } = useAuth();
  const [medicineName, setMedicineName] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scheduledTimeouts, setScheduledTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    // Check notification permission on mount
    if ("Notification" in window) {
      setPermissionGranted(Notification.permission === "granted");
    }

    // Load reminders from Firestore
    if (!user) return;

    const remindersRef = collection(db, "users", user.uid, "reminders");
    const remindersQuery = query(remindersRef, orderBy("time", "asc"));
    
    const unsubscribe = onSnapshot(remindersQuery, (snapshot) => {
      const loadedReminders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reminder[];
      
      setReminders(loadedReminders);
      
      // Schedule notifications for all reminders
      loadedReminders.forEach((reminder) => {
        scheduleNotification(reminder);
      });
    });

    return () => {
      unsubscribe();
      // Clean up all scheduled timeouts
      scheduledTimeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [user]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser doesn't support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      setPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPermissionGranted(true);
        toast.success("Notifications enabled!");
        return true;
      } else {
        toast.error("Notification permission denied");
        return false;
      }
    }

    toast.error("Notifications are blocked. Please enable them in browser settings.");
    return false;
  };

  const scheduleNotification = (reminder: Reminder) => {
    if (!permissionGranted && Notification.permission !== "granted") return;

    // Clear existing timeout for this reminder
    const existingTimeout = scheduledTimeouts.get(reminder.id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const [hours, minutes] = reminder.time.split(":").map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      new Notification("💊 Medicine Reminder", {
        body: `Time to take ${reminder.medicineName}${reminder.note ? `\n${reminder.note}` : ""}`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: reminder.id,
        requireInteraction: true,
      });

      // Reschedule for next day
      scheduleNotification(reminder);
    }, timeUntilReminder);

    setScheduledTimeouts((prev) => new Map(prev).set(reminder.id, timeout));
  };

  const handleSetReminder = async () => {
    if (!user) {
      toast.error("Please sign in to set reminders");
      return;
    }

    if (!medicineName.trim() || !time) {
      toast.error("Please enter medicine name and time");
      return;
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    try {
      const remindersRef = collection(db, "users", user.uid, "reminders");
      const newReminder = {
        medicineName: medicineName.trim(),
        time,
        note: note.trim(),
        timestamp: new Date(),
      };

      await addDoc(remindersRef, newReminder);
      
      toast.success(`Reminder set for ${medicineName} at ${time}`);
      
      // Clear form
      setMedicineName("");
      setTime("");
      setNote("");
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast.error("Failed to set reminder");
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "reminders", reminderId));
      
      // Clear timeout
      const timeout = scheduledTimeouts.get(reminderId);
      if (timeout) {
        clearTimeout(timeout);
        setScheduledTimeouts((prev) => {
          const newMap = new Map(prev);
          newMap.delete(reminderId);
          return newMap;
        });
      }
      
      toast.success("Reminder deleted");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="mt-4 pl-16 pr-4">
        <div className="bg-background rounded-2xl p-6 border border-border space-y-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
              <Bell className="w-4 h-4 text-primary" />
              Set Medicine Reminder
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicineName" className="text-xs">
                Medicine Name *
              </Label>
              <Input
                id="medicineName"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="e.g., Aspirin, Vitamin D"
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderTime" className="text-xs">
                Reminder Time *
              </Label>
              <Input
                id="reminderTime"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-xs">
                Optional Note
              </Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Take with food"
                className="h-9 text-sm"
              />
            </div>

            <Button onClick={handleSetReminder} size="sm" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
          </div>

          {/* Saved Reminders */}
          {reminders.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Your Reminders
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start justify-between gap-3 bg-card p-3 rounded-xl border border-border/60"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {reminder.medicineName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.time}
                        {reminder.note && ` • ${reminder.note}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="h-7 w-7 p-0 shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!permissionGranted && (
            <p className="text-xs text-muted-foreground italic">
              💡 Browser notifications will be requested when you set your first reminder.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineReminders;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import { db } from "@/lib/firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  User,
  Moon,
  Sun,
  Globe,
  Type,
  Users,
  Bell,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Member {
  id: string;
  name: string;
  age: number;
  relation: string;
}

interface Reminder {
  id: string;
  memberId: string;
  memberName: string;
  message: string;
  time: Date;
  completed: boolean;
}

interface SOSEvent {
  id: string;
  memberId: string;
  memberName: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  mapsLink: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, fontSize, setFontSize, language, setLanguage } = useSettings();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [sosEvents, setSOSEvents] = useState<SOSEvent[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  // Loading states
  const [addingMember, setAddingMember] = useState(false);
  const [deletingMember, setDeletingMember] = useState<string | null>(null);
  const [addingReminder, setAddingReminder] = useState(false);

  // Member form
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", age: "", relation: "" });

  // Reminder form
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [newReminder, setNewReminder] = useState({ message: "", datetime: "" });

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive reminders and emergency alerts.",
        });
      }
    }
  };

  // Load members
  useEffect(() => {
    if (!user) return;

    const loadMembers = async () => {
      try {
        const membersSnapshot = await getDocs(collection(db, "users", user.uid, "members"));
        const membersList = membersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Member[];
        setMembers(membersList);
      } catch (error) {
        console.error("Error loading members:", error);
      }
    };

    loadMembers();
  }, [user]);

  // Load reminders
  useEffect(() => {
    if (!user) return;

    const remindersQuery = query(
      collection(db, "reminders"),
      where("userId", "==", user.uid),
      where("completed", "==", false)
    );

    const unsubscribe = onSnapshot(remindersQuery, (snapshot) => {
      const remindersList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          memberId: data.memberId,
          memberName: data.memberName,
          message: data.message,
          time: data.time instanceof Timestamp ? data.time.toDate() : new Date(data.time),
          completed: data.completed,
        };
      }) as Reminder[];
      setReminders(remindersList);

      // Set up browser notifications
      remindersList.forEach((reminder) => {
        scheduleNotification(reminder);
      });
    });

    return () => unsubscribe();
  }, [user]);

  // Listen for SOS events
  useEffect(() => {
    if (!user) return;

    const sosQuery = query(collection(db, "sos_events"), where("ownerId", "==", user.uid));

    const unsubscribe = onSnapshot(sosQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const sosEvent: SOSEvent = {
            id: change.doc.id,
            memberId: data.memberId,
            memberName: data.memberName,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
            latitude: data.latitude,
            longitude: data.longitude,
            mapsLink: data.mapsLink,
          };

          // Show notification
          if (Notification.permission === "granted") {
            new Notification("🚨 Emergency Alert!", {
              body: `${sosEvent.memberName} has triggered an SOS alert!`,
              icon: "/sudha-logo.png",
              tag: sosEvent.id,
            });
          }

          // Show toast
          toast({
            title: "🚨 Emergency Alert!",
            description: `${sosEvent.memberName} has triggered an SOS alert!`,
            variant: "destructive",
          });

          setSOSEvents((prev) => [sosEvent, ...prev]);
        }
      });
    });

    return () => unsubscribe();
  }, [user, toast]);

  const scheduleNotification = (reminder: Reminder) => {
    const timeUntilReminder = reminder.time.getTime() - Date.now();

    if (timeUntilReminder > 0 && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification("⏰ Reminder", {
          body: `${reminder.memberName}: ${reminder.message}`,
          icon: "/sudha-logo.png",
        });
      }, timeUntilReminder);
    }
  };

  // Add member
  const handleAddMember = async () => {
    if (!user?.uid) {
      console.error("Cannot add member: User not authenticated");
      toast({
        title: "Authentication Required",
        description: "Please log in to add members.",
        variant: "destructive",
      });
      return;
    }

    if (members.length >= 4) {
      toast({
        title: "Maximum Members Reached",
        description: "You can only add up to 4 members (including yourself).",
        variant: "destructive",
      });
      return;
    }

    if (!newMember.name || !newMember.age || !newMember.relation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all member details.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names
    if (members.some((m) => m.name.toLowerCase() === newMember.name.toLowerCase())) {
      toast({
        title: "Duplicate Member",
        description: "A member with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    setAddingMember(true);
    console.log("Adding member:", newMember);

    try {
      const memberRef = await addDoc(collection(db, "users", user.uid, "members"), {
        name: newMember.name,
        age: parseInt(newMember.age),
        relation: newMember.relation,
        createdAt: serverTimestamp(),
      });

      const newMemberData: Member = {
        id: memberRef.id,
        name: newMember.name,
        age: parseInt(newMember.age),
        relation: newMember.relation,
      };

      setMembers([...members, newMemberData]);
      setNewMember({ name: "", age: "", relation: "" });
      setShowMemberForm(false);

      console.log("Member added successfully:", newMemberData);
      toast({
        title: "Member Added",
        description: `${newMember.name} has been added successfully.`,
      });
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingMember(false);
    }
  };

  // Delete member
  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!user?.uid) {
      console.error("Cannot delete member: User not authenticated");
      return;
    }

    setDeletingMember(memberId);
    console.log("Deleting member:", memberName);

    try {
      await deleteDoc(doc(db, "users", user.uid, "members", memberId));
      setMembers(members.filter((m) => m.id !== memberId));

      console.log("Member deleted successfully:", memberName);
      toast({
        title: "Member Removed",
        description: `${memberName} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member.",
        variant: "destructive",
      });
    } finally {
      setDeletingMember(null);
    }
  };

  // Add reminder
  const handleAddReminder = async () => {
    if (!user?.uid) {
      console.error("Cannot add reminder: User not authenticated");
      toast({
        title: "Authentication Required",
        description: "Please log in to add reminders.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMemberId || !newReminder.message || !newReminder.datetime) {
      toast({
        title: "Missing Information",
        description: "Please select a member, enter a message, and set a time.",
        variant: "destructive",
      });
      return;
    }

    const selectedMember = members.find((m) => m.id === selectedMemberId);
    if (!selectedMember) return;

    const reminderTime = new Date(newReminder.datetime);
    if (reminderTime.getTime() <= Date.now()) {
      toast({
        title: "Invalid Time",
        description: "Reminder time must be in the future.",
        variant: "destructive",
      });
      return;
    }

    setAddingReminder(true);
    console.log("Adding reminder for:", selectedMember.name, "at", reminderTime);

    try {
      await addDoc(collection(db, "reminders"), {
        userId: user.uid,
        memberId: selectedMemberId,
        memberName: selectedMember.name,
        message: newReminder.message,
        time: Timestamp.fromDate(reminderTime),
        completed: false,
        createdAt: serverTimestamp(),
      });

      setNewReminder({ message: "", datetime: "" });
      setSelectedMemberId("");
      setShowReminderForm(false);

      console.log("Reminder added successfully");
      toast({
        title: "Reminder Set",
        description: `Reminder for ${selectedMember.name} has been set.`,
      });
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast({
        title: "Error",
        description: "Failed to set reminder.",
        variant: "destructive",
      });
    } finally {
      setAddingReminder(false);
    }
  };

  // Mark reminder as complete
  const handleCompleteReminder = async (reminderId: string) => {
    try {
      await setDoc(doc(db, "reminders", reminderId), { completed: true }, { merge: true });

      toast({
        title: "Reminder Completed",
        description: "Reminder marked as complete.",
      });
    } catch (error) {
      console.error("Error completing reminder:", error);
    }
  };

  // Delete reminder
  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await deleteDoc(doc(db, "reminders", reminderId));

      toast({
        title: "Reminder Deleted",
        description: "Reminder has been removed.",
      });
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-2">
                Profile Settings
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Log out
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  Appearance
                </CardTitle>
                <CardDescription>Customize your viewing experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                </div>

                {/* Font Size */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    <Type className="w-4 h-4 inline mr-2" />
                    Font Size
                  </Label>
                  <Select value={fontSize} onValueChange={(value) => setFontSize(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (14px)</SelectItem>
                      <SelectItem value="medium">Medium (16px)</SelectItem>
                      <SelectItem value="large">Large (18px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Language
                  </Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage notification permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {notificationPermission === "granted" ? (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Notifications are enabled. You'll receive reminders and emergency alerts.
                    </AlertDescription>
                  </Alert>
                ) : notificationPermission === "denied" ? (
                  <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertDescription>
                      Notifications are blocked. Please enable them in your browser settings.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enable notifications to receive reminders and emergency alerts.
                    </p>
                    <Button onClick={requestNotificationPermission}>Enable Notifications</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Member Management */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Family Members
                    </CardTitle>
                    <CardDescription>Manage up to 4 family members (including yourself)</CardDescription>
                  </div>
                  {members.length < 4 && (
                    <Button onClick={() => setShowMemberForm(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showMemberForm && (
                  <Card className="mb-6 border-primary">
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="Enter member name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Age</Label>
                            <Input
                              type="number"
                              value={newMember.age}
                              onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                              placeholder="Age"
                            />
                          </div>
                          <div>
                            <Label>Relation</Label>
                            <Select
                              value={newMember.relation}
                              onValueChange={(value) => setNewMember({ ...newMember, relation: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="self">Self</SelectItem>
                                <SelectItem value="spouse">Spouse</SelectItem>
                                <SelectItem value="parent">Parent</SelectItem>
                                <SelectItem value="child">Child</SelectItem>
                                <SelectItem value="sibling">Sibling</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddMember} className="flex-1" disabled={addingMember}>
                            {addingMember ? "Adding..." : "Add Member"}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowMemberForm(false);
                              setNewMember({ name: "", age: "", relation: "" });
                            }}
                            variant="outline"
                            disabled={addingMember}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {members.length === 0 ? (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No family members added yet.</p>
                    </div>
                  ) : (
                    members.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{member.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {member.age} years • {member.relation}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDeleteMember(member.id, member.name)}
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingMember === member.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reminders */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Member Reminders
                    </CardTitle>
                    <CardDescription>Set reminders for family member medications or appointments</CardDescription>
                  </div>
                  {members.length > 0 && (
                    <Button onClick={() => setShowReminderForm(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reminder
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showReminderForm && (
                  <Card className="mb-6 border-primary">
                    <CardContent className="pt-6">
                      <div className="grid gap-4">
                        <div>
                          <Label>Select Member</Label>
                          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a member" />
                            </SelectTrigger>
                            <SelectContent>
                              {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Reminder Message</Label>
                          <Input
                            value={newReminder.message}
                            onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                            placeholder="e.g., Take morning medication"
                          />
                        </div>
                        <div>
                          <Label>Date & Time</Label>
                          <Input
                            type="datetime-local"
                            value={newReminder.datetime}
                            onChange={(e) => setNewReminder({ ...newReminder, datetime: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddReminder} className="flex-1" disabled={addingReminder}>
                            {addingReminder ? "Setting..." : "Set Reminder"}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowReminderForm(false);
                              setNewReminder({ message: "", datetime: "" });
                              setSelectedMemberId("");
                            }}
                            variant="outline"
                            disabled={addingReminder}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {reminders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No active reminders.</p>
                    </div>
                  ) : (
                    reminders.map((reminder) => (
                      <Card key={reminder.id}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{reminder.memberName}</p>
                              <p className="text-sm text-muted-foreground mb-1">{reminder.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {reminder.time.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleCompleteReminder(reminder.id)}
                                size="sm"
                                variant="outline"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteReminder(reminder.id)}
                                size="sm"
                                variant="ghost"
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Alerts */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-sos" />
                  Emergency Alerts
                </CardTitle>
                <CardDescription>Recent SOS alerts from family members</CardDescription>
              </CardHeader>
              <CardContent>
                {sosEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No emergency alerts.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sosEvents.map((event) => (
                      <Alert key={event.id} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{event.memberName} triggered SOS</p>
                              <p className="text-xs opacity-90">{event.timestamp.toLocaleString()}</p>
                            </div>
                            <Button asChild size="sm" variant="outline">
                              <a href={event.mapsLink} target="_blank" rel="noopener noreferrer">
                                View Location
                              </a>
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

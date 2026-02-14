# Smart SOS Feature - Firebase & Twilio Setup Guide

## Firebase Firestore Rules

Add the following rules to your `firestore.rules` file to allow emergency data storage:

```javascript
// Emergency collection rules
match /emergencies/{emergencyId} {
  // Allow authenticated users to create emergency entries
  allow create: if request.auth != null;
  
  // Allow users to read their own emergency entries
  allow read: if request.auth != null && 
                 request.auth.uid == resource.data.userId;
  
  // Admin can read all emergencies (add admin check as needed)
  allow read: if request.auth != null && 
                 request.auth.token.admin == true;
}
```

## Emergency Data Structure

The emergency data saved to Firebase has the following structure:

```typescript
{
  userId: string,           // User's Firebase Auth UID
  userEmail: string,        // User's email
  latitude: number,         // GPS latitude
  longitude: number,        // GPS longitude
  mapsLink: string,        // Google Maps URL
  timestamp: Timestamp,    // Server timestamp
  status: "triggered"      // Emergency status
}
```

## Twilio SMS Integration (Optional)

### Step 1: Install Twilio SDK

```bash
npm install twilio
```

### Step 2: Get Twilio Credentials

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Purchase a phone number

### Step 3: Add to Firebase Functions

Create `functions/src/sendEmergencySMS.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const twilio = require('twilio');

const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const twilioPhone = functions.config().twilio.phone_number;
const client = twilio(accountSid, authToken);

export const sendEmergencySMS = functions.firestore
  .document('emergencies/{emergencyId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    // Get user's emergency contact from their profile
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(data.userId)
      .get();
    
    const emergencyContact = userDoc.data()?.emergencyContact;
    
    if (!emergencyContact) {
      console.log('No emergency contact found for user');
      return;
    }

    const message = `
🚨 EMERGENCY ALERT - SUDHA Healthcare

${data.userEmail} has triggered an emergency alert.

Location: ${data.mapsLink}

Time: ${new Date(data.timestamp._seconds * 1000).toLocaleString()}

This is an automated alert from SUDHA Healthcare Platform.
    `.trim();

    try {
      await client.messages.create({
        body: message,
        from: twilioPhone,
        to: emergencyContact
      });
      
      console.log('Emergency SMS sent successfully');
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  });
```

### Step 4: Set Twilio Config

```bash
firebase functions:config:set twilio.account_sid="YOUR_ACCOUNT_SID"
firebase functions:config:set twilio.auth_token="YOUR_AUTH_TOKEN"
firebase functions:config:set twilio.phone_number="+1234567890"
```

### Step 5: Deploy Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

## User Profile Setup

Add emergency contact to user profile:

```typescript
// In user settings/profile
interface UserProfile {
  emergencyContact?: string; // Phone number like "+919876543210"
  emergencyContactName?: string;
}
```

## Testing

### Test Geolocation

1. Open browser DevTools (F12)
2. Go to Sensors tab
3. Override geolocation
4. Test SOS modal

### Test Firebase

1. Trigger SOS
2. Check Firebase Console > Firestore
3. Verify emergency document created

### Test SMS (Production Only)

1. Add emergency contact to user profile
2. Deploy Twilio function
3. Trigger SOS
4. Verify SMS received

## Security Notes

⚠️ **Important:**

1. Never expose Twilio credentials in frontend code
2. Always use Firebase Functions for SMS
3. Rate limit emergency triggers (prevent spam)
4. Implement user verification
5. Log all emergency events
6. Have manual override/disable capability

## Rate Limiting (Recommended)

Add to Firestore rules:

```javascript
match /emergencies/{emergencyId} {
  allow create: if request.auth != null &&
    // Only allow 1 emergency per 5 minutes per user
    !exists(/databases/$(database)/documents/emergencies/$(request.auth.uid + '_' + string(request.time.toMillis() / 300000)));
}
```

## Cost Estimates

- **Firebase:** Free tier covers most use cases
- **Twilio:** ~$0.0075 per SMS (US)
- **Google Maps API:** Free for basic usage

## Legal Compliance

⚠️ **Disclaimer Requirements:**

Always display:
- "This does not replace official emergency services (108/112)"
- "For life-threatening emergencies, call emergency services immediately"
- Privacy policy regarding location data collection
- Terms of service for emergency feature usage

## Contact for Help

For issues or questions, check:
- Firebase Console
- Twilio Console logs
- Browser console for geolocation errors

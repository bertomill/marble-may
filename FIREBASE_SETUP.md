# Firebase Setup Instructions

To properly configure Firebase for this project, you need to create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACfnMQjEWbs5bwFeWlZqHN6RECR9u9wfQ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=marble-b120c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=marble-b120c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=marble-b120c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=259929837932
NEXT_PUBLIC_FIREBASE_APP_ID=1:259929837932:web:b556335ae7b14cdb022349
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-X09G960BE3
```

After creating this file, you'll need to restart your development server for the changes to take effect.

The app is configured to use these environment variables rather than hardcoded values for better security and to make it easier to switch between different Firebase projects.

## Steps:

1. Create a new file named `.env.local` in the project root
2. Copy and paste the variables above
3. Restart your development server
4. The app should now connect to your new Firebase project

Note: Make sure not to commit the `.env.local` file to version control. It should already be in your `.gitignore` file. 
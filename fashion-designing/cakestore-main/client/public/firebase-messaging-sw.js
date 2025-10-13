

importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Firebase config - use environment variables in vite.config.js
const firebaseConfig = {
    apiKey: "AIzaSyD4Q6aApKEmzqwR7L7dvATZdcIXNYZKaPQ", // Replace with your actual API key
    authDomain: "bellebyokien-a737f.firebaseapp.com",
    projectId: "bellebyokien-a737f",
    storageBucket: "bellebyokien-a737f.firebasestorage.app",
    messagingSenderId: "106276820197",
    appId: "1:106276820197:web:7a386b6e9b6382e48d700c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification?.title || 'New message';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/logo192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});





import firebase from 'firebase/app';
import 'firebase/messaging';
import { CometChat } from "@cometchat-pro/chat";

// https://prodocs.cometchat.com/docs/js-extensions-push-notification
export function initializeFirebase() {
  if (firebase.messaging.isSupported()) {
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_FIREBASE_APP_ID,
      measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
    };


    // Initialize Firebase app
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    // Request Permission for Web Push
    messaging.requestPermission().then(() => {
      return messaging.getToken();
    }).then(token => {
      console.log('TOKEN = ', token)
      // Do something with TOken like subscribe to topics
      CometChat.getAppSettings().then(settings => {
        var appToken;
        settings.extensions.forEach(ext => {
          if (ext.id == "push-notification") appToken = ext.appToken;
        });

        var userType = "group";
        var GUID = process.env.VUE_APP_COMMETCHAT_GUID;
        var appId = process.env.VUE_APP_COMMETCHAT_APP_ID;
        var region = "eu";
        var topic = appId + "_" + userType + "_" + GUID;
        var url = "https://push-notification-"+ region +".cometchat.io/v1/subscribe?appToken=" + appToken + "";
        fetch(url, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          }),
          body: JSON.stringify({ appId: appId, fcmToken: token, topic: topic })
        })
        .then(response => {
          if (response.status < 200 || response.status >= 400) console.log("Error subscribing to topic: " + response.status + " - " + response.text());
          console.log('Subscribed to "' + topic + '"');
        })
        .catch(error => {
          console.error(error);
        });
      });
    })
    .catch(error => {
      if (error.code === 'messaging/permission-blocked') {
        console.log('Please Unblock Notification Request Manually');
      } else {
        console.log('Error Occurred', error);
      }
    });


    // Receive Message
    messaging.onMessage(function(payload) {
      // Customize notification here
      var notificationTitle = "CometChat Pro Notification";
      console.log(payload)
      var notificationOptions = {
        body: payload.data.alert,
        icon: ""
      };

      var notification = new Notification(notificationTitle, notificationOptions);

      notification.onclick = function() {
        notification.close();
      };
    });
  }
}
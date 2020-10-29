<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import { CometChat } from "@cometchat-pro/chat";
  import { initializeFirebase } from './pushNotification';
  import "./App.css";
  export default {
    created() {
      // https://attacomsian.com/blog/desktop-notifications-javascript
      if (!window.Notification) {
        console.log('Browser does not support notifications.');
      } else {
        if (Notification.permission === 'granted') {
        } else {
        Notification.requestPermission().then(function(p) {
          if (p === 'granted') {}
          else console.log('User blocked notifications.');
        }).catch(function(err) {
          console.error(err);
        });
      }
    }

    this.initializeApp();
    initializeFirebase();
  },
  methods: {
    initializeApp() {
      const { VUE_APP_COMMETCHAT_APP_ID } = process.env
      CometChat.init(VUE_APP_COMMETCHAT_APP_ID).then(
        () => {
          console.log("Initialization completed successfully");
        },
        error => {
          console.log("Initialization failed with error:", error);
        }
        );
    }
  }
  };
</script>
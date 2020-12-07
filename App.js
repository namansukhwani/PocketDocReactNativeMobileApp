import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import SplashScreen from 'react-native-splash-screen';
import { ConfigureStore } from './redux/Store';
import Main from './components/main_routing';
import LoadingScreen from './components/loadingScreen';
import { AuthService } from './Services/videoCalling/AuthService';
// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-community/async-storage';
// import PushNotification from "react-native-push-notification";

const { store, persistor } = ConfigureStore();

export default class App extends React.Component {

  constructor(props) {
    super(props);
    global.url = "https://pdoc-api.herokuapp.com/";
    global.userAuthData = {};
    global.deviceToken = "";

    //services
    AuthService.init();
  }

  componentDidMount() {
    SplashScreen.hide();
    // this.checkNotificationPermission();
    // this.notificationListner();
  }

  // componentWillUnmount() {
  //   this.listnerNotification();
  // }

  // async checkNotificationPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     this.getNotificationToken()
  //   }
  // }

  // async getNotificationToken() {

  //   const fcmToken = await AsyncStorage.getItem('fcmToken',)

  //   if (fcmToken === null) {
  //     messaging().getToken()
  //       .then(token => {
  //         AsyncStorage.setItem('fcmToken', token);
  //         global.deviceToken = token;
  //         console.log("FCM Token::", token);
  //       })
  //       .catch(err => { console.log(err); });
  //   }
  //   else {
  //     global.deviceToken = fcmToken;
  //     console.log("FCM Token::", fcmToken);
  //   }
  // }

  // notificationListner() {
  //   this.listnerNotification = messaging().onMessage(message => {
  //     console.log(message);
  //     PushNotification.createChannel(
  //       {
  //         channelId: "channel-id", // (required)
  //         channelName: "My channel", // (required)
  //         //channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  //         //soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //         //importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //         //vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  //       },
  //       (created) => {
  //         PushNotification.localNotification({
  //           channelId: "channel-id",
  //           ticker: "My Notification Ticker", // (optional) 
  //           title: message.notification.title, // (optional)
  //           message: message.notification.body, // (required)
  //           // priority: "max", // (optional) set notification priority, default: high
  //           // visibility: "private", // (optional) set notification visibility, default: private
  //           //color:'#147',
  //           group:"Pocket Doc",
  //           tag:message.notification.title,
  //           // ignoreInForeground: false,
  //           // onlyAlertOnce:true,
  //           // actions: ["Yes", "No"],
  //           // ignoreInForeground:false,
  //           groupSummary:true,
  //           messageId:message.messageId
  //         })
  //       }// (optional) callback returns whether the channel was created, false means it already existed.
  //     );
     
  //   })
  // }

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<LoadingScreen backgroundColor="#fff" color="#147EFB" />}
          persistor={persistor}
        >
          <Main />
        </PersistGate>
      </Provider>
    );
  }
};


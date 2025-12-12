import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {

  constructor(private messaging: Messaging) {}

  requestPermission() {
    return getToken(this.messaging, {
      vapidKey: "YOUR_VAPID_KEY"
    }).then(token => {
      console.log("FCM Token:", token);
      return token;
    });
  }

  listen() {
    onMessage(this.messaging, payload => {
      console.log("Message received:", payload);
    });
  }

}

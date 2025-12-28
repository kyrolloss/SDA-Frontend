import { Injectable } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  constructor(private messaging: Messaging) {}

  

  requestPermission() {
    return getToken(this.messaging, {
      vapidKey: environment.vapidKey,
    })
      .then((token) => {
        if (!token) {
          console.warn('No FCM token generated');
          return null;
        }
        return token;
      })
      .catch((err) => {
        console.error('FCM error:', err);
        return null;
      });
  }

  listen() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
    });
  }
}

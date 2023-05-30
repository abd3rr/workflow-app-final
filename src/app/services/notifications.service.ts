import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() {}
  private _notifications = [
    'Notification 1',
    'Notification 2',
    'Notification 3',
  ];

  get notifications() {
    return this._notifications;
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent {
  constructor(private notificationsService: NotificationsService) {}
  @Output() closeSidenav = new EventEmitter();

  onClose() {
    this.closeSidenav.emit();
  }
  notifications: string[] = [];
}

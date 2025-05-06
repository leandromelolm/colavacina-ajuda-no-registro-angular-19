import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms
}

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  private toastSubject = new Subject<ToastMessage>();
  toastState$ = this.toastSubject.asObservable();

  show(message: ToastMessage) {
    this.toastSubject.next(message);
  }
}

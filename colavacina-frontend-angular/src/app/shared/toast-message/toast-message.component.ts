import { Component } from '@angular/core';
import { ToastMessage, ToastMessageService } from '../../service/toast-message.service';

@Component({
  selector: 'app-toast-message',
  standalone: false,
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {

  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastMessageService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe((toast: ToastMessage) => {
      this.toasts.push(toast);
      const index = this.toasts.length - 1;
      const timeout = toast.duration ?? 3000;

      setTimeout(() => {
        this.toasts.splice(index, 1);
      }, timeout);
    });
  }
}

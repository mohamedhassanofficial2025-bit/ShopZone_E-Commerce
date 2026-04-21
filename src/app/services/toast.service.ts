import { Injectable, signal } from '@angular/core';
import { ToastItem, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly nextId = signal(0);
  readonly toasts = signal<ToastItem[]>([]);

  show(title: string, message: string, type: ToastType = 'info', duration = 3200) {
    const id = this.nextId() + 1;
    this.nextId.set(id);

    const toast: ToastItem = {
      id,
      title,
      message,
      type,
      duration,
    };

    this.toasts.update((items) => [...items, toast]);

    window.setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  success(title: string, message: string, duration?: number) {
    this.show(title, message, 'success', duration);
  }

  error(title: string, message: string, duration?: number) {
    this.show(title, message, 'error', duration);
  }

  warning(title: string, message: string, duration?: number) {
    this.show(title, message, 'warning', duration);
  }

  info(title: string, message: string, duration?: number) {
    this.show(title, message, 'info', duration);
  }

  dismiss(id: number) {
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }
}

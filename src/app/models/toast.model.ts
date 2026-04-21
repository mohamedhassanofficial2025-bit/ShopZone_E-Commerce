export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: number;
  title: string;
  message: string;
  type: ToastType;
  duration: number;
}

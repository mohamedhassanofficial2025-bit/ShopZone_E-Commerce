import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Cart } from '../pages/cart/cart';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  getCartItems(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart?userId=${userId}`);
  }
  addToCart(item: CartItem): Observable<CartItem> {
    return this.http.post<CartItem>(`${environment.apiUrl}/cart`, item);
  }
  removeFromCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/cart/${cartId}`);
  }
  updateQuantity(cartId: number, item: CartItem): Observable<CartItem> {
    return this.http.patch<CartItem>(`${environment.apiUrl}/cart/${cartId}`, item);
  }
  clearCart(userId: number): Observable<void> {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/cart?userId=${userId}`).pipe(
      switchMap((items) => {
        const deleteRequests = items.map((item) =>
          this.http.delete(`${environment.apiUrl}/cart/${item.id}`),
        );
        return forkJoin(deleteRequests).pipe(map(() => void 0));
      }),
    );
  }
}


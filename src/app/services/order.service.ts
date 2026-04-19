import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, OrderItem } from '../models/order.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) { }
  
  getOrders(userId: number):Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders?userId=${userId}`)
  }
  placeOrder(userId: number,order: Order):Observable<Order>{
    return this.http.post<Order>(`${environment.apiUrl}/orders`, order);
  }
}

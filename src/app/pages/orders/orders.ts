import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit{
  orders: Order[] = [];
  userId:number= Number(localStorage.getItem('userId'))
  NoOrders: number=0; 
  constructor(private orderService: OrderService,
    private cdr:ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.orderService.getOrders(this.userId).subscribe({
      next: (or) => {
        console.log(or)
        this.orders = or;
        if (or.length > 0) {
          this.NoOrders = 1;
        }
        this.cdr.detectChanges();
      }
    })
  }
}

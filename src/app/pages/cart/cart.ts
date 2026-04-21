import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItem } from '../../models/cart-item.model';
import { FormControl, FormsModule } from "@angular/forms";
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router, RouterLink } from "@angular/router";
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  NoCarts: number = 0;
  items: CartItem[] = [];
  products: Product[] = [];
  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getCartReady();
  }

  getCartReady() {
    const userId: number = Number(localStorage.getItem('userId'));
    this.cartService.getCartItems(userId).subscribe({
      next: (cartItems) => {
        this.items = cartItems;
        this.cdr.detectChanges();
        if (this.items.length > 0) {
          this.NoCarts = 1;
        }
      },
    });
    this.productService.getAllProducts().subscribe({
      next: (pros) => {
        this.products = pros;
        this.cdr.detectChanges();
      },
    });
  }

  changeQuantity(item: CartItem, Q: number): any {
    const pro: Product = this.products.find((p) => (p.id = item.productId)) as Product;
    if (Q > pro.stock || Q <= 0) {
      this.toastService.warning('Quantity updated', 'Please choose a valid quantity within the available stock.');
      Q = pro.stock;
    }
    let itemId: number = item.id as number;
    this.cartService.updateQuantity(itemId, item).subscribe({
      next: (curItem) => {
        item = curItem;
        this.getCartReady();
      },
    });
  }
  remove(cartId: number | undefined) {
    let itemId: number = cartId as number;
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.cdr.detectChanges();
        this.getCartReady();
      },
    });
  }

  getTotal(): number {
    let total: number = 0;
    this.items.forEach((items) => {
      total += items.price * items.quantity;
    });

    return total;
  }

  proceedToCheckout() {
    this.router.navigateByUrl('/checkout');
  }

  AddOrder() {
    let order: Order = {} as Order;
    order.date = new Date();
    order.status = 'processing';
    order.total = this.getTotal();

    order.items = this.items.map(cartItem => ({
      productId: cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      quantity:cartItem.quantity
    }));

    const userId: number = Number(localStorage.getItem('userId'));
    order.userId = userId;
    this.orderService.placeOrder(userId, order).subscribe({
      next: (res) => {
        console.log(res);
        this.cartService.clearCart(userId).subscribe();
        this.toastService.success('Order placed', 'Your order has been placed successfully.');
        this.router.navigateByUrl('/orders');
      }
    })

  }
}

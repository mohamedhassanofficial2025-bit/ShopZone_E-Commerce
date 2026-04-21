import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cart-item.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  checkoutForm: FormGroup;
  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.checkoutForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      city: new FormControl('', Validators.required),
      address: new FormControl('', [Validators.required, Validators.minLength(8)]),
      deliveryMethod: new FormControl('standard', Validators.required),
      paymentMethod: new FormControl('card', Validators.required),
      cardName: new FormControl('', Validators.required),
      cardNumber: new FormControl('', [Validators.required, Validators.minLength(16)]),
      expiry: new FormControl('', [Validators.required, Validators.minLength(5)]),
      cvv: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit(): void {
    this.loadCheckoutData();
  }

  loadCheckoutData() {
    const userId = Number(localStorage.getItem('userId'));

    this.cartService.getCartItems(userId).subscribe({
      next: (items) => {
        this.items = items;

        if (!items.length) {
          this.toastService.info('Cart is empty', 'Add products to your cart before checkout.');
          this.router.navigateByUrl('/cart');
          return;
        }

        this.cdr.detectChanges();
      },
    });
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getShippingFee() {
    const deliveryMethod = this.checkoutForm.get('deliveryMethod')?.value;
    return deliveryMethod === 'express' ? 120 : 45;
  }

  getFinalTotal() {
    return this.getSubtotal() + this.getShippingFee();
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toastService.warning('Complete the form', 'Please fill in the checkout details before continuing.');
      return;
    }

    const order: Order = {
      userId: Number(localStorage.getItem('userId')),
      date: new Date(),
      status: 'processing',
      total: this.getSubtotal(),
      items: this.items.map((cartItem) => ({
        productId: cartItem.id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
      })),
    };

    this.orderService.placeOrder(order.userId, order).subscribe({
      next: () => {
        this.cartService.clearCart(order.userId).subscribe({
          next: () => {
            this.toastService.success('Payment confirmed', 'Your order was placed successfully.');
            this.router.navigateByUrl('/orders');
          },
        });
      },
    });
  }
}

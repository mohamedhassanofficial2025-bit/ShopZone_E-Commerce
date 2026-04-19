import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart-item.model';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  curUserId: number = 0;
  cartItems: CartItem[] = [];
  products: Product[] = [];
  curProduct: Product = {} as Product;
  // item: CartItem = {} as CartItem;
  selectedQuant: number = 0;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.getDataReady()
  }
  getDataReady() {
    //*get user id
    this.curUserId = Number(localStorage.getItem('userId'));
    //*get data of current item
    this.route.paramMap.subscribe({
      next: (params) => {
        const productId: number = Number(params.get('id'));
        this.getProductById(productId);
        this.cdr.detectChanges();
      },
    });

    //? get all cartitems
    this.cartService.getCartItems(this.curUserId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cdr.detectChanges();
      },
    });
  }
  /**
   * * get product by Id
   * @param id : is the id of proudct
   */

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (pro) => {
        console.log(pro);
        this.curProduct = pro;
        this.cdr.detectChanges();
      },
    });
  }

  addToCart() {
    const item: CartItem = {} as CartItem;
    item.name = this.curProduct.name;
    item.productId = this.curProduct.id;
    item.price = this.curProduct.price;
    item.userId = this.curUserId;
    if (this.selectedQuant <= this.curProduct.stock) {
      item.quantity = this.selectedQuant;
    } else {
      item.quantity = this.curProduct.stock;
      alert(`you add max number of item ${this.curProduct.stock}`);
    }
    if (this.IsAddedAlready(item)) {
      alert("already added to card");
    } else {
      this.AddItemToCart(item);
    }
  }

  AddItemToCart(item: CartItem) {
    this.cartService.addToCart(item).subscribe({
      next: (res) => {
        console.log(res);
        alert('item added successfully to cart');
      },
    });
  }

  IsAddedAlready(item: CartItem) {
    this.getDataReady();
    return this.cartItems.find((i) => i.name == item.name);
  }
}

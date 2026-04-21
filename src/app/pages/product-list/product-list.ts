import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Catatgory } from '../../models/Catagory';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  curUserId: number = 0;
  catagorySeleted: string = 'all';
  filteredProducts: Product[] = [];
  cartItems: CartItem[] = [];
  products: Product[] = [];
  catagories: Catatgory[] = [];
  searchText: string = '';

  /**
   *
   * @param productService : this service give you all function to deal with the server
   * @param cdr : detect the change in page
   * @param router: navigate between pages
   */
  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  /**
   * ? initialize the conponent with data
   */
  ngOnInit(): void {
    //get user id
    this.curUserId = Number(localStorage.getItem('userId'));

    this.getDataReady();
  }

  /**
   * !get all products and catagories and put it in arrays
   */
  getDataReady() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res);
        this.products = res;
        this.filteredProducts = this.products;
        this.cdr.detectChanges();
      },
    });
    this.productService.getAllCategory().subscribe({
      next: (res) => {
        console.log(res);
        this.catagories = res;
        this.cdr.detectChanges();
      },
    });
    this.cartService.getCartItems(this.curUserId).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * * get Product by Cat
   * @param cat : the catagory of product
   */

  getByCategory(cat: string) {
    this.productService.getByCategory(cat).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  /**
   * * get product by Id
   * @param id : is the id of proudct
   */

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  /**
   * * filter products depend on catagory
   */

  filterProducts() {
    if (this.catagorySeleted === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter((p) => p.category === this.catagorySeleted);
    }
  }

  Add(curProduct: Product) {
    //if this item is added before

    let item: CartItem = {} as CartItem;
    item.name = curProduct.name;
    item.productId = curProduct.id;
    item.price = curProduct.price;
    item.userId = this.curUserId;
    item.quantity = 1;

    if (this.IsAddedAlready(item)) {
      this.toastService.warning('Already in cart', 'This product is already added to your cart.');
    } else {
      this.AddItemToCart(item);
    }
  }

  AddItemToCart(item: CartItem) {
    this.cartService.addToCart(item).subscribe({
      next: (res) => {
        console.log(res);
        this.toastService.success('Added to cart', 'The item was added to your cart successfully.');
      },
    });
  }

  IsAddedAlready(item: CartItem) {
    this.getDataReady();
    return this.cartItems.find((i) => i.name == item.name);
  }

  Details(productId: number) {
    this.router.navigateByUrl(`products/${productId}`);
  }

  searchProducts() {
    const search = this.searchText.toLowerCase();

    this.filteredProducts = this.products.filter((pro) => pro.name.toLowerCase().includes(search));
  }
}

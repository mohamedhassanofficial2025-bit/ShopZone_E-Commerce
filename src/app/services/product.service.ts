import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { Catatgory } from '../models/Catagory';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private http: HttpClient) { }
  
  getAllProducts():Observable<Product[]> { 
    return this.http.get<Product[]>(`${environment.apiUrl}/products`)
  }
  getProductById(id: number):Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`)
  }
  getByCategory(cat:string):Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products?category=${cat}`)
  }
  getAllCategory() :Observable<Catatgory[]>{
    return this.http.get<Catatgory[]>(`${environment.apiUrl}/categories`);
  }
}

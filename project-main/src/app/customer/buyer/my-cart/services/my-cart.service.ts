import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyCartService {

  public cart_url = environment.server_url + '/cart/';
  private cartProductsTotal = new BehaviorSubject(0);
  private cartProducts = new BehaviorSubject([]);
  currentCartTotal = this.cartProductsTotal.asObservable();
  currentProducts = this.cartProducts.asObservable();

  constructor(private apiService: ApiService) { }

  allProduct(): Observable<any> {
    return this.apiService.get(this.cart_url)
  }

  singleProduct(id) {
    return this.apiService.get(this.cart_url + id)
  }

  updateQuantity(id, product): Observable<any> {
    return this.apiService.put(this.cart_url + id, product)
  }

  cartTotal(total: number, products: any) {
    this.cartProductsTotal.next(total)
    this.cartProducts.next(products)
  }

  addToCart(product): Observable<any> {
    return this.apiService.post(this.cart_url, product);
  }

  deleteProduct(id): Observable<any> {
    return this.apiService.delete(this.cart_url + id);
  }

  deleteMultipleProducts(products) {
    products.forEach(product => {
      this.deleteProduct(product.id).subscribe()
    });
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private single_product_id = new BehaviorSubject(null);
  currentProduct = this.single_product_id.asObservable();
  private products_information = new BehaviorSubject(null);
  multiple_products = this.products_information.asObservable();
  private sourceJson = new BehaviorSubject(null);
  product_source = this.sourceJson.asObservable();

  public product_url = environment.server_url + '/products/';
  public cart_url = environment.server_url + '/cart/';
  public user_url = environment.server_url + '/user/';
  public order_url = environment.server_url + '/orders/';
  public category_url = environment.server_url + '/category/';

  constructor(private apiService: ApiService) { }

  allProduct(): Observable<any> {
    return this.apiService.get(this.product_url)
  }

  allCategory(): Observable<any> {
    return this.apiService.get(this.category_url)
  }

  quickBuyProduct(product_id: number, source: string) {
    this.single_product_id.next(product_id)
    this.sourceJson.next(source)
  }

  buyManyProducts(products: any[]) {
    this.products_information.next(products)
  }

  individualProduct(id, source) {
    let loc = source === "products" ? this.product_url + id : this.cart_url + id
    return this.apiService.get(loc)
  }

  userDetail(id) {
    return this.apiService.get(this.user_url + id)
  }

  insertNewOrder(order_dto): Observable<any> {
    return this.apiService.post(this.order_url, order_dto);
  }

  insertNewOrders(order_dto): Observable<any> {
    return this.apiService.post(this.order_url, order_dto)
  }

  orderDashboardData(): Observable<any> {
    return this.apiService.get(this.order_url)
  }
  productDashboardData(): Observable<any> {
    return this.apiService.get(this.product_url)
  }
}

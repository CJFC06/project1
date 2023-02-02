import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { MyCartService } from '../my-cart/services/my-cart.service';

@Component({
  selector: 'app-buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {

  all_products
  searched_products
  current_products
  cart_products
  all_categories: any[] = []
  show_checkout: Boolean = false
  buttonVisible: Boolean = false
  searchText: string = ""
  priceFilteredMin: number | undefined
  priceFilteredMax: number | undefined

  constructor(private router: Router, private customerService: CustomerService, private myCartService: MyCartService) { }

  ngOnInit() {
    this.getAllProduct()
  }

  searchProducts() {
    let temp = this.current_products.filter(data => data.name.toLowerCase().includes(this.searchText.trim().toLowerCase()))
    this.searched_products = temp
  }

  getCategoryName(product): string {
    let category = this.all_categories.find(data => data.id === product.categoryID)
    return category ? category.name : 'Unknown';
  }

  filterPrice() {
    let temp = this.current_products.filter(data => data.php >= this.priceFilteredMin && data.php <= this.priceFilteredMax && this.searchProducts && this.filterProducts)
    if (!this.priceFilteredMin) {
      temp = this.current_products.filter(data => data.php <= this.priceFilteredMax && this.searchProducts && this.filterProducts)
    }
    if (!this.priceFilteredMax) {
      temp = this.current_products.filter(data => data.php >= this.priceFilteredMin && this.searchProducts && this.filterProducts)
    }
    this.searched_products = temp
  }

  filterProducts(category) {
    this.buttonVisible = true;
    let temp = this.all_products.filter(data => data.categoryID === category.id)
    this.searched_products = temp
    this.current_products = temp
  }

  getAllProduct() {
    this.buttonVisible = false;
    this.customerService.allProduct().subscribe(data => {
      this.all_products = data;
      this.searched_products = data
      this.current_products = data
    }, error => {
      console.log("My error", error);
    })

    this.customerService.allCategory().subscribe(data => {
      this.all_categories = data
    }, error => {
      console.log("My error", error);
    })

    this.myCartService.allProduct().subscribe(data => {
      this.cart_products = data
    }, error => {
      console.log("My error", error);
    })
    this.priceFilteredMax = null
    this.priceFilteredMin = null
  }

  buyProduct(id) {
    this.show_checkout = true;
    this.customerService.quickBuyProduct(id, "products") //We pass to serice from service we can access in another component
    this.router.navigateByUrl("/checkout");
  }

  addToCart(product) {
    const index = this.cart_products.findIndex(cart => cart.id === product.id)
    if (index > -1) {
      this.addQuantity(this.cart_products[index])
    }
    else {
      product['qty'] = 1
      this.myCartService.addToCart(product).subscribe(data => {
        this.getAllProduct()
      }), err => {
        alert("Some error occured!")
      }
    }
  }

  addQuantity(product) {
    ++product.qty
    this.myCartService.updateQuantity(product.id, product).subscribe(data => {
    }, err => {
      alert("Some error occured!")
    })
  }

}

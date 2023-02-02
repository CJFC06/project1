import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Product, User, Order, Products } from '../../../core/models/object-model';
import { MyCartService } from '../my-cart/services/my-cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  single_product_id: number
  product_source: string
  multiple_products: Product[] = null
  user_id: number
  individual_product: Product = null
  user_detail: User
  user_address
  user_contact_no: number
  order_dto: Order;
  multi_amount: number = 0

  all_categories: any[] = []

  constructor(private customerService: CustomerService, private router: Router, private myCartService: MyCartService) { }

  ngOnInit() {
    this.customerService.currentProduct.subscribe(product => this.single_product_id = product)
    this.customerService.product_source.subscribe(source => this.product_source = source)
    this.customerService.multiple_products.subscribe(multiple => this.multiple_products = multiple)
    this.user_id = Number(sessionStorage.getItem('user_session_id'));
    if (this.multiple_products) {
      this.productsDetail(this.multiple_products)
    }
    else {
      this.productDetail(this.single_product_id, this.product_source);
    }
    this.userAddress(this.user_id);
    this.getAllCategories()
  }

  getCategoryName(product): string {
    let category = this.all_categories.find(data => data.id === product)
    return category ? category.name : 'Unknown';
  }

  getAllCategories() {
    this.customerService.allCategory().subscribe(data => {
      this.all_categories = data
    }, error => {
      console.log("My error", error);
    })
  }

  productDetail(single_product_id, product_source) {
    this.customerService.individualProduct(single_product_id, product_source).subscribe(data => {
      this.individual_product = data;
      console.log("One Product", this.individual_product);
    }, error => {
      console.log("My error", error);
    })
  }

  productsDetail(multiple_products) {
    let total = 0
    for (let i = 0; i < multiple_products.length; i++) {
      console.log(multiple_products[i])
      total += multiple_products[i].php * multiple_products[i].qty
    }
    this.multi_amount = total
    console.log(this.multi_amount)
  }

  userAddress(user_id) {
    this.customerService.userDetail(user_id).subscribe(data => {
      // this.user_detail = data.address;
      this.user_address = data.address;
      this.user_contact_no = data.mobNumber;
    }, error => {
      console.log("My error", error);
    })
  }

  placeOrder() {
    if (this.multiple_products) {
      this.order_dto = {
        id: 0,
        userId: this.user_id,
        sellerId: 0, //Now it is hard coded, we are not implimented multi seller functionlity
        products: {
          product: this.multiple_products
        },
        orderTotal: this.multi_amount,
        deliveryAddress: {
          id: 0,
          addLine1: this.user_address.addLine1,
          addLine2: this.user_address.addLine2,
          city: this.user_address.city,
          state: this.user_address.state,
          zipCode: Number(this.user_address.zipCode)
        },
        contact: this.user_contact_no,
        dateTime: new Date().toLocaleDateString()
      }
    }
    else {
      this.order_dto = {
        id: 0,
        userId: this.user_id,
        sellerId: 0, //Now it is hard coded, we are not implimented multi seller functionlity
        products: {
          id: this.individual_product.id,
          name: this.individual_product.name,
          uploadPhoto: this.individual_product.uploadPhoto,
          categoryID: this.individual_product.categoryID,
          qty: this.individual_product.qty ? this.individual_product.qty : 1,
          mrp: this.individual_product.mrp,
          php: this.individual_product.php,
          status: this.individual_product.status
        },
        orderTotal: this.individual_product.php * this.individual_product.qty,
        deliveryAddress: {
          id: 0,
          addLine1: this.user_address.addLine1,
          addLine2: this.user_address.addLine2,
          city: this.user_address.city,
          state: this.user_address.state,
          zipCode: Number(this.user_address.zipCode)
        },
        contact: this.user_contact_no,
        dateTime: new Date().toLocaleDateString()
      }
    }

    if (this.multiple_products) {
      this.customerService.insertNewOrder(this.order_dto).subscribe(data => {
        // console.log("Order placed successfully", data);
        alert("Order places successfully")
        this.router.navigateByUrl("/buyer-dashboard");
      }, err => {
        alert("Some Error Occured");
      })

      for (let i = 0; i < this.multiple_products.length; i++) {
        this.myCartService.deleteProduct(this.multiple_products[i].id).subscribe(item => {
        }, err => {
          alert("Some error occured!")
        })
      }
    }
    else {
      this.customerService.insertNewOrders(this.order_dto).subscribe(data => {
        // console.log("Order placed successfully", data);
        alert("Order places successfully")
        this.router.navigateByUrl("/buyer-dashboard");
      }, err => {
        alert("Some Error Occured");
      })
      
      this.myCartService.deleteProduct(this.individual_product.id).subscribe()
    }
    // console.log("Place order dto", this.order_dto);

  }

}

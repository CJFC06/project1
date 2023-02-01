import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { MyCartService } from './services/my-cart.service';
declare var jQuery: any;

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {

  all_products: any[] = []
  single_product_data
  edit_product_id
  all_categories: any[] = []
  itemChecklist: any[] = []
  masterChk = false
  itemCheck = false
  childChecked: any[] = []
  current_product: any = ''
  total_price: number = 0

  constructor(private router: Router, private customerService: CustomerService, private myCartService: MyCartService) { }
  
  ngOnInit() {
    this.getAllProduct()
    
  }

  masterChange() {
    this.childChecked = Array(this.all_products.length).fill(this.masterChk)
    console.clear()
    this.updateTotal()
  }
  
  checkItem(event: any, index: number) {
    if (event.target.checked) {
      this.masterChk = this.childChecked.every(value => value === true);
    }
    else {
      this.masterChk = false
    }
    console.clear()
    console.log(this.childChecked)
    this.updateTotal()
  }

  updateTotal() {
    this.total_price = 0
    for (let i = 0; i < this.childChecked.length; i++) {
      if (this.childChecked[i]) {
        this.total_price += this.all_products[i].php * this.all_products[i].qty
      }
    }
  }

  checkOut() {
    console.clear()
    let out_products: any[] = []
    if (!this.childChecked.includes(true)) {
      console.log("None selected!")
    }
    else {
      let j = 0
      let single = 0
      for (let i = 0; i < this.childChecked.length; i++) {
        if (this.childChecked[i] === true) {
          j++
          single = i
          out_products.push(this.all_products[i])
        }
      }
      if (j < 2) {
        this.buyProduct(this.all_products[single].id)
      }
      else {
        this.buyManyProducts(out_products)
      }
    }
  }

  buyProduct(id) {
    this.customerService.quickBuyProduct(id, "cart")
    this.router.navigateByUrl("/checkout");
  
  }
  
  buyManyProducts(products) {
    this.customerService.buyManyProducts(products)
    this.router.navigateByUrl("/checkout");
  }

  getAllProduct() {
    this.myCartService.allProduct().subscribe(data => {
      this.all_products = data
      this.childChecked = Array(data.length).fill(false);
    }, error => {
      console.log("My error", error);
    })

    this.customerService.allCategory().subscribe(data => {
      this.all_categories = data
    }, error => {
      console.log("My error", error);
    })
  }

  getCategoryName(product): string {
    let category = this.all_categories.find(data => data.id === product.categoryID)
    return category ? category.name : 'Unknown';
  }

  increaseQuantity(product) {
    ++product.qty
    this.myCartService.updateQuantity(product.id, product).subscribe(data => {

    }, err => {
      alert("Some error occured!")
    })
  }

  decreaseQuantity(product) {
    this.current_product = product
    if (product.qty <= 1) {
      jQuery('#removeProductModal').modal('toggle')
    }
    else {
      --product.qty
      this.myCartService.updateQuantity(product.id, product).subscribe(data => {
        
      }, err => {
        alert("Some error occured!")
      })
    }
  }
  
  removeProduct() {
    this.myCartService.deleteProduct(this.current_product.id).subscribe(data => {
      this.getAllProduct()
    }, err => {
      alert("Some error occured!")
    })
    jQuery('#removeProductModal').modal('toggle')
  }
  
  straightRemove(product) {
    this.current_product = product
    jQuery('#removeProductModal').modal('toggle')
  }
}

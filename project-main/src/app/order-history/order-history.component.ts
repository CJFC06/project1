import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer/services/customer.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  all_orders

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.getAllOrders()
  }

  getAllOrders() {
    this.customerService.allOrders().subscribe(data => {
      this.all_orders = data;
    }, error => {
      console.log("My error", error);
    })
  }
}

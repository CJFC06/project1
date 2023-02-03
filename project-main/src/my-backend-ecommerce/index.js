const express = require('express');
var cors = require('cors');
const connection = require('./connection'); //for db connection
const userRoute = require('./routes/user'); //for user route
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');
const billRoute = require('./routes/bill');
const dashboardRoute = require('./routes/dashboard');
const customerRoute = require('./routes/customer');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);  
app.use('/product', productRoute);  
app.use('/bill', billRoute);  
app.use('/dashboard', dashboardRoute);  
app.use('/customer', customerRoute);  

module.exports = app;
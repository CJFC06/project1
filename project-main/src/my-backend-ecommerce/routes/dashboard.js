const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');


router.get('/details', auth.authenticateToken, (req, res, next) => {
    var categoryCount;
    var productCount;
    var billCount;
    var userCount;
    var cat_query = "SELECT COUNT (id) AS categoryCount FROM category";
    connection.query(cat_query, (err,results) => {
        if(!err) {
            categoryCount = results[0].categoryCount;
        }
        else {
            return res.status(500).json(err);
        }
    })

    var prod_query = "SELECT COUNT (id) AS productCount FROM product";
    connection.query(prod_query, (err,results) => {
        if(!err) {
            productCount = results[0].productCount;
        }
        else {
            return res.status(500).json(err);
        }
    })
    
    var user_query = "SELECT COUNT (id) AS userCount FROM user WHERE role LIKE '%customer%'";
    connection.query(user_query, (err,results) => {
        if(!err) {
            userCount = results[0].userCount;
        }
        else {
            return res.status(500).json(err);
        }
    })

    var bill_query = "SELECT COUNT (id) AS billCount FROM bill";
    connection.query(bill_query, (err,results) => {
        if(!err) {
            billCount = results[0].billCount;
            var data = {
                category : categoryCount,
                product  : productCount,
                bill     : billCount,
                customer     : userCount
            };
            return res.status(200).json(data);
        }
        else {
            return res.status(500).json(err);
        }
    })

})

router.get('/getTopProducts', auth.authenticateToken, (req, res, next) => {
    query = "SELECT product.name, SUM(sales.quantity) as total_sales, product.price FROM sales JOIN product ON sales.item_id = product.id GROUP BY product.name, product.price ORDER BY total_sales DESC LIMIT 5";
    connection.query(query, (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
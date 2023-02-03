const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.get('/getCategoryName', auth.authenticateToken, (req, res, next) => {
    let category = req.body;
    query = "SELECT * FROM product WHERE name LIKE '%keyword%'";
    connection.query(query, [category.keyword], (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getCategoryName', auth.authenticateToken, (req, res, next) => {
    query = "SELECT * FROM product JOIN category ON product.category_id = category.id";
    connection.query(query, (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/filterProducts', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    query = "SELECT * FROM product WHERE name LIKE '%keyword%'";
    connection.query(query, (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getAllProduct', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    query = "SELECT * FROM product ORDER BY name";
    connection.query(query, (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/buyProduct/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT id FROM product WHERE id=?";
    connection.query(query, [id], (err,results) => {
        if(!err) {
            return res.status(200).json(results[0]);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.post('/addToCart', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let cart = req.body;
    query = "INSERT INTO cart (quantity, product_id) values(?,?)";
    connection.query(query, [cart.quantity, cart.product_id], (err,results) => {
        if(!err) {
            return res.status(200).json({message : "Product Added To Cart Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/addQuantity', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let cart = req.body;
    query = "UPDATE cart SET quantity=? WHERE id=?";
    connection.query(query, [cart.quantity, cart.id], (err,results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message : "Product id does not found."});
            }
            return res.status(200).json({message : "Product Quantity Updated Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
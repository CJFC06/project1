const express = require('express');
const multer = require('multer');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


// const upload = multer({ storage });

router.post('/add',  auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let product = req.body;

    query = "INSERT INTO product (name, category_id, description, price, status, disc_price, stock) values(?,?,?,?,'true',?,?)";
    connection.query(query, [product.name, product.category_id, product.description, product.price, product.disc_price, product.stock], (err,results) => {
        if(!err) {
            return res.status(200).json({message : "Product Added Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/get', auth.authenticateToken, (req, res, next) => {
    query = "SELECT p.id, p.name, p.description, p.price, p.status, p.image_name, p.disc_price, p.stock, c.id AS categoryId, c.name AS categoryName FROM product AS p INNER JOIN category AS c WHERE p.category_id = c.id ORDER BY status DESC";
    connection.query(query, (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT id, name FROM product WHERE category_id=? AND status='true'";
    connection.query(query, [id], (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "SELECT id, name, description, price FROM product WHERE id=?";
    connection.query(query, [id], (err,results) => {
        if(!err) {
            return res.status(200).json(results[0]);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "UPDATE product SET name=?, category_id=?, description=?, price=?, image_name=?, disc_price=?, stock=? WHERE id=?";
    connection.query(query, [product.name, product.category_id, product.description, product.price, product.image_name, product.disc_price, product.stock, product.id], (err,results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message : "Product id does not found."});
            }
            return res.status(200).json({message : "Product Updated Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "DELETE FROM product WHERE id=?";
    connection.query(query, [id], (err,results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message : "Product id does not found."});
            }
            return res.status(200).json({message : "Product Deleted Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "UPDATE product SET status=? WHERE id=?";
    connection.query(query, [user.status, user.id], (err,results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message : "Product id does not found."});
            }
            return res.status(200).json({message : "Product Status Updated Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    query = "INSERT INTO category (name) values(?)";
    connection.query(query, [category.name], (err,results) => {
        if(!err) {
            return res.status(200).json({message : "Category Added Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, (req, res, next) => {
    query = "SELECT * FROM category ORDER BY name";
    connection.query(query, (err,results) => {
        if(!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    query = "UPDATE category SET name=? WHERE id=?";
    connection.query(query, [product.name, product.id], (err,results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message : "Category id does not found."});
            }
            return res.status(200).json({message : "Category Updated Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "DELETE FROM category WHERE id=?";
    connection.query(query, [id], (err,results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message : "Category id does not found."});
            }
            return res.status(200).json({message : "Category Deleted Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
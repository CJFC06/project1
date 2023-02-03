const express = require('express');
const connection = require('../connection');
// const email_template = require('../email_design/email.html');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');
const { text } = require('body-parser');

require('dotenv').config();


// FOR SIGNUP
router.post('/signup',(req,res) => {
    let user = req.body;
    query = "SELECT email, password, role, status FROM user WHERE email=?"
    connection.query(query,[user.email],(err,results) => {
        if(!err) {
            if(results.length <= 0) {
                add_query = "INSERT INTO user(first_name, last_name, middle_name, email, cellphone_number, password, status, role) VALUES(?,?,?,?,?,?,'false','user')";
                connection.query(add_query,[user.first_name, user.last_name, user.middle_name, user.email, user.cellphone_number, user.password],(err,results) => {
                    if(!err) {
                        return res.status(200).json({message: "Successfully Registered"});
                    } 
                    else {
                        return res.status(500).json(err);
                    }
                })
            } 
            else {
                return res.status(400).json({message: "Email Already Exist!"})
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// FOR LOGIN AND TOKEN
router.post('/login',(req,res) => {
    const user = req.body;
    login_query = "SELECT email, password, role, status FROM user WHERE email=?";
    connection.query(login_query, [user.email], (err, results) => {
        if(!err) {
            if(results.length <= 0 || results[0].password !== user.password || results[0].email !== user.email) {
                return res.status(401).json({message: "Incorrect Email or Password"})
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({message: "Wait for Admin Approval"});
            } else if (results[0].password === user.password) {
                const acc_response = { email : results[0].email, role: results[0].role }
                const accessToken = jwt.sign(acc_response, process.env.ACCESS_TOKEN, {expiresIn: '8h'})
                res.status(200).json({token : accessToken});
            } else {
                return res.status(400).json({message: "Something went wrong. Please try again later."})
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

// FOR SENDING EMAIL USING NODE-MAILER
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
})

transporter.use('compile',hbs({
    viewEngine: {
        extname: '.handlebars',
        layoutsDir: './assets/',
        defaultLayout : 'emailTemplate',
    },
    viewPath: './assets/'
}))

router.post('/forgetPassword', (req,res) => {
    const user = req.body;
    query = "SELECT email, password FROM user WHERE email=?";
    connection.query(query, [user.email], (err,results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(200).json({message : "Password sent successfully to your email"});
            }
            else {
                var mailConfig = {
                    from    : process.env.EMAIL,
                    to      : results[0].email,
                    subject : 'Password by My Ecommerce Shop.',
                    template: 'emailTemplate',
                    context:{
                        name: results[0].email, // replace {{name}} with Adebola
                        company: results[0].password // replace {{company}} with My Company
                    }
                    // html    : '<p><b>Your Login credentials for Kicks Zone</b><br><b>Email : </b>' + results[0].email + '<br><b>Password : </b>' + results[0].password + '<br><a href="http://localhost:4200/">Click here to login</a></p>'
                };
                transporter.sendMail(mailConfig, function(error,info) {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log('Email sent :' + info.response);
                    }
                });
                return res.status(200).json({message : "Password sent successfully to your email."});
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    query = "INSERT INTO user(first_name, last_name, middle_name, email, cellphone_number, password, status, role) VALUES(?,?,?,?,?,?,'false','user')";
    connection.query(query, [user.first_name, user.last_name, user.middle_name, user.email, user.cellphone_number, user.password], (err,results) => {
        if(!err) {
            return res.status(200).json({message : "User Added Successfully."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "SELECT id, first_name, last_name, middle_name, email, cellphone_number, status, role FROM user WHERE role LIKE '%customer%' OR  role LIKE '%user%'";
    connection.query(query, (err, results) => {
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "UPDATE user set status=? WHERE id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: "User id does not exist."});
            }
            return res.status(200).json({message : "User update successfuly."});
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', auth.authenticateToken, (req,res) => {
    return res.status(200).json({message : "true"});
})

router.post('/changePassword', auth.authenticateToken, (req,res) => {
    const user = req.body;
    const email = res.locals.email;

    var query = "SELECT * FROM user WHERE email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(400).json({message : "Incorrect Old Password."});
            }
            else if(results[0].password == user.oldPassword) {
                query = "UPDATE user SET password=? WHERE email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if(!err) {
                        return res.status(200).json({message : "Password Updated Successfully."});
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({message : "Something went wrong. Please try again later."});
            }
        } else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getProfile', auth.authenticateToken, (req, res) => {
    const email = res.locals.email;
    
    var query = "SELECT id, first_name, last_name, middle_name, email, cellphone_number FROM user WHERE email=?";
    connection.query(query, [email], (err, results) => {
        if(!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateProfile', auth.authenticateToken, (req,res) => {
    const user = req.body;
    const email = res.locals.email;

        var query = "UPDATE user SET first_name=?, last_name=?, middle_name=?, cellphone_number=? WHERE email=?";
        connection.query(query, [user.first_name , user.last_name , user.middle_name , user.cellphone_number ,  email], (err, results) => {
            if(!err) {
                return res.status(200).json({message : "Password Updated Successfully."});
            }
            else {
                return res.status(500).json(err);
            }
        })
})

module.exports = router;
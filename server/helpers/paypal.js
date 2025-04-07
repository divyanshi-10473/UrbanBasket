const paypal = require('paypal-rest-sdk');
require('dotenv').config();

paypal.configure({
    mode: 'sandbox', 
    client_id: process.env.YOUR_CLIENT_ID,
    client_secret: process.env.YOUR_CLIENT_SECRET

})

module.exports= paypal;
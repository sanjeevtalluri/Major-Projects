
const { where } = require('sequelize');
const Order = require('../models/order');
const Razorpay = require('razorpay');


exports.buyPremium = async (req, res, next) => {
    const amount = 100;
    try {
        var rzrInstance = new Razorpay({
            key_id: 'rzp_test_zoplJnq1cqleD7',
            key_secret: 'V1qOzMWtjH9yo6vwkrQQOgA6',
        });
        rzrInstance.orders.create({
            amount,
            currency: "INR"
        }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderId: order.id, status: 'Pending' }).then(() => {
                res.status(201).json({ order, key_id: rzrInstance.key_id });
            })
                .catch(err => {
                    throw new Error(err);
                })
        })
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}
exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { order_id, payment_id } = req.body;
        Order.findOne({ where: { orderId: order_id } }).then(order => {
            console.log(order);
            const promise1 = order.update({ paymentId: payment_id, status: 'Successful' });
            const promise2 = req.user.update({ isPremiumUser: true });
            Promise.all([promise1, promise2]).then((values) => {
                res.status(201).json({ message: 'payment successful', success: true });
            });
        })
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}
exports.updateTransactionStatusFail = async (req, res, next) => {
    try {
        const { order_id } = req.body;
        Order.findOne({ where: { orderId: order_id } }).then(order => {
            order.update({ status: 'Failed' }).then(() => {
                res.status(201).json({ message: 'payment failed' });
            })
        })
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}



const sequelize = require('../util/database');
const Order = require('../models/order');
const Razorpay = require('razorpay');


exports.buyPremium = async (req, res, next) => {
    const t = await sequelize.transaction();
    const amount = 100;
    try {
        var rzrInstance = new Razorpay({
            key_id: 'rzp_test_zoplJnq1cqleD7',
            key_secret: 'V1qOzMWtjH9yo6vwkrQQOgA6',
        });
        rzrInstance.orders.create({
            amount,
            currency: "INR"
        }, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({ orderId: order.id, status: 'Pending' }, { transaction: t });
            t.commit();
            res.status(201).json({ order, key_id: rzrInstance.key_id });
        })
    }
    catch (err) {
        t.rollback();
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}
exports.updateTransactionStatus = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { order_id, payment_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });
        const promise1 = order.update({ paymentId: payment_id, status: 'Successful' }, { transaction: t });
        const promise2 = req.user.update({ isPremiumUser: true }, { transaction: t });
        Promise.all([promise1, promise2]).then((values) => {
            t.commit();
            res.status(201).json({ message: 'payment successful', success: true });
        });
    }
    catch (err) {
        t.rollback();
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}
exports.updateTransactionStatusFail = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { order_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });
        await order.update({ status: 'Failed' },{transaction:t});
        res.status(201).json({ message: 'payment failed' });
    }
    catch (err) {
        t.rollback();
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}


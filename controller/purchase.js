const Razorpay = require('razorpay');
const Order = require('../model/order');

// Function to create a new premium membership order
exports.createPremiumMembershipOrder = async (req, res, next) => {
  try {
    // Create a new Razorpay instance
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 2500;

    // Create a new order using the Razorpay API
    rzp.orders.create({ amount: amount, currency: 'INR' }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      // Create a new order in the database and associate it with the current user
      await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

      // Send the order details and Razorpay key to the client
      res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: 'Something went wrong', error: err });
  }
};

// Function to update the transaction status of a premium membership order
exports.updateTransactionStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    console.log('reqatpost------>>>>>', req.body);

    // Find the order in the database and update its payment status
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({ paymentid: payment_id, status: 'successful' });

    // Update the user's premium membership status
    const promise2 = req.user.update({ isPremiumUser: true });

    // Wait for both promises to resolve before sending the response
    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({ success: true, message: 'Transaction successful' });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    throw new Error(err);
  }
};

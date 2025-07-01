const paypal = require("../../helpers/paypal");
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const dotenv = require('dotenv');
dotenv.config();

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        // const newlyCreatedOrder = new Order({
        //   userId,
        //   cartId,
        //   cartItems,
        //   addressInfo,
        //   orderStatus,
        //   paymentMethod,
        //   paymentStatus,
        //   totalAmount,
        //   orderDate,
        //   orderUpdateDate,
        //   paymentId,
        //   payerId,
        // });

        // await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;
      
        res.status(201).json({
          success: true,
          approvalURL,
          // orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, userId, cartItems, addressInfo, totalAmount } = req.body;

    if (!paymentId || !payerId) {
      return res.status(400).json({
        success: false,
        message: "Missing paymentId or payerId",
      });
    }

    paypal.payment.execute(
      paymentId,
      { payer_id: payerId },
      async (error, payment) => {
        if (error) {
          console.error("Error executing payment:", error.response);
          return res.status(500).json({
            success: false,
            message: "Error while executing PayPal payment",
            details: error.response,
          });
        }

        console.log("Payment executed successfully:", JSON.stringify(payment, null, 2));

        // CREATE order here
        const newOrder = new Order({
          userId,
          cartItems,
          addressInfo,
          orderStatus: "confirmed",
          paymentMethod: "paypal",
          paymentStatus: "paid",
          totalAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId,
          payerId,
        });

        // Decrease stock
        for (let item of cartItems) {
          let product = await Product.findById(item.productId);
          if (product) {
            product.totalStock -= item.quantity;
            await product.save();
          }
        }

        await newOrder.save();

        res.status(200).json({
          success: true,
          message: "Payment captured and order confirmed",
          data: newOrder,
        });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};



const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};

import Order from '../models/order.js';
import catchAsync from "../utils/catchAsync.js";
import Stripe from 'stripe';
import resend from '../libs/resend.js'
import {formatCurrency} from '../helpers/formatCurrency.js'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {order} = req.body;
    const newOrder = await Order.create({...order,user:id});
    res.status(200).json({message:'success'});
})

export const handleGetAllOrders = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const orders = await Order.find({customer:id});
    res.status(200).json({ok:true,orders});
    
})

export const handleGetAllSellerOrders = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const orders = await Order.find({seller:id});
    res.status(200).json({ok:true,orders});
    
})
export const handleShipOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {orderId} = req.params;
    const order = await Order.findByIdAndUpdate(orderId,{status:'shipped'},{new:true});
     const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #5cb85c;">Your Order #${
        order._id
      } Has Been Shipped!</h2>
      <p>Dear ${order.customerName},</p>
      <p>Good news 🎉! Your order for <strong>${
        order.productName
      }</strong> has been shipped and is on its way.</p>

      <h3>Order Details</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Product:</strong> ${order.productName}</li>
        <li><strong>Total Amount:</strong> ${formatCurrency(order.totalAmount)}</li>
        <li><strong>Status:</strong> Shipped</li>
        <li><strong>Shipped On:</strong> ${new Date(
          order.updatedAt
        ).toLocaleDateString()}</li>
        <li><strong>Expected Delivery:</strong> ${new Date(
          order.deliveryExpected
        ).toLocaleDateString()}</li>
      </ul>

      <p>We will notify you once the package is delivered.</p>

      <p style="margin-top: 30px;">Thanks for shopping with us.<br/>— The MyBazar Team</p>
    </div>
  `;

     // Send email to customer
     await resend.emails.send({
       from: "My-Bazarr <hello@my-bazarr.in>",
       to: order.email,
       subject: `Your Order #${order._id} Has Been Shipped`,
       html: customerHtml,
     });
    res.status(200).json({ok:true});
    
})
export const handleCancelOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {orderId} = req.params;
    const order = await Order.findByIdAndUpdate(orderId,{status:'cancelled'},{new:true}).populate('seller');
    const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #d9534f;">Your Order #${
        order._id
      } Has Been Cancelled</h2>
      <p>Dear ${order.customerName},</p>
      <p>Your order for <strong>${
        order.productName
      }</strong> has been cancelled.</p>

      <h3>Order Details</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Product:</strong> ${order.productName}</li>
        <li><strong>Total:</strong> ${formatCurrency(order.totalAmount)}</li>
        <li><strong>Status:</strong> Cancelled</li>
        <li><strong>Placed On:</strong> ${new Date(
          order.createdAt
        ).toLocaleDateString()}</li>
      </ul>

      <p>If you have already made a payment, refunds (if applicable) will be processed within 5–7 business days.</p>

      <p style="margin-top: 30px;">Thanks for shopping with us.<br/>— The MyBazar Team</p>
    </div>
  `;

    // Seller email
    const sellerHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #d9534f;">Order #${order._id} Cancelled</h2>
      <p>Hello ${order.seller?.name || "Seller"},</p>
      <p>The customer <strong>${
        order.customerName
      }</strong> has cancelled their order.</p>

      <h3>Order Details</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Product:</strong> ${order.productName}</li>
        <li><strong>Total:</strong> ${formatCurrency(order.totalAmount)}</li>
        <li><strong>Status:</strong> Cancelled</li>
        <li><strong>Placed On:</strong> ${new Date(
          order.createdAt
        ).toLocaleDateString()}</li>
      </ul>

      <p>Please ensure no shipment is made for this order.</p>

      <p style="margin-top: 30px;">Regards,<br/>— The MyBazar System</p>
    </div>
  `;

    // Send email to customer
    await resend.emails.send({
      from: "My-Bazarr <hello@my-bazarr.in>",
      to: order.email,
      subject: `Order #${order._id} Cancelled`,
      html: customerHtml,
    });
    // Send email to seller (if seller has email in DB)
    if (order.seller?.email) {
      await resend.emails.send({
        from: "My-Bazarr <hello@my-bazarr.in>",
        to: order.seller.email,
        subject: `Order #${order._id} Cancelled by Customer`,
        html: sellerHtml,
      });
    }
    res.status(200).json({ok:true});
    
})
export const handleOrderDelivered = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {orderId} = req.params;
    const order = await Order.findByIdAndUpdate(orderId,{status:'delivered'});
     const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2 style="color: #28a745;">Your Order #${
        order._id
      } Has Been Delivered!</h2>
      <p>Dear ${order.customerName},</p>
      <p>We’re happy to let you know 🎉 that your order for <strong>${
        order.productName
      }</strong> has been successfully delivered.</p>

      <h3>Order Summary</h3>
      <ul style="padding-left: 20px;">
        <li><strong>Product:</strong> ${order.productName}</li>
        <li><strong>Total Paid:</strong> ${formatCurrency(order.totalAmount)}</li>
        <li><strong>Status:</strong> Delivered</li>
        <li><strong>Delivered On:</strong> ${new Date(
          order.updatedAt
        ).toLocaleDateString()}</li>
      </ul>

      <p>We hope you enjoy your purchase. If you face any issues, feel free to contact our support.</p>

      <p style="margin-top: 30px;">Thank you for shopping with us!<br/>— The MyBazar Team</p>
    </div>
  `;

     // Send email to customer
     await resend.emails.send({
       from: "MyBazar <no-reply@mybazar.com>",
       to: order.email,
       subject: `Your Order #${order._id} Has Been Delivered`,
       html: customerHtml,
     });
    res.status(200).json({ok:true});
})

export const handleGetOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {orderId} = req.params;
    const order = await Order.findById(orderId).populate('seller');
    res.status(200).json({ok:true,order});
})

export const handleCheckoutOrder = catchAsync(async (req,res,next) => {
    console.log('fff')
    const {id} = req.user;
    const {item} = req.body;
    console.log(item)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer: req.user.customerId,
      client_reference_id: id,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
        price_data: {
        currency: "inr",
        unit_amount: item.price * 100,
        product_data: {
          name: item.name,
          images: [item.coverImage],
          description: item.description,
        },
        
      },quantity:item.quantity},
        // Delivery fee (fixed)
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "_Delivery Fee",
            },
            unit_amount: item.deliveryCharges * 100, // 100 INR*100
          },
          quantity: 1,
        },
      ],
      discounts: [{ coupon: "nMdPosp9" }],
      metadata: {
        purchaseType:'single',
        productId: item.productId,
        sellerEmail: item.sellerEmail,
        sellerId:item.sellerId,
        shipping: item.deliveryCharges,
      },
      success_url: `${
        process.env.ENVIROMENT === "production"
          ? process.env.LOCAL_URL
          : process.env.URL
      }/app/purchases/orders`,
      cancel_url: `${
        process.env.ENVIROMENT === "production"
          ? process.env.LOCAL_URL
          : process.env.URL
      }/app/purchases/cart`,
    });
    res.status(200).json({ok:true,id:session.id});
})
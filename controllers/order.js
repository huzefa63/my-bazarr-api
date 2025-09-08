import Order from '../models/order.js';
import catchAsync from "../utils/catchAsync.js";
import Stripe from 'stripe';
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

export const handleGetOrder = catchAsync(async (req,res,next) => {
    const {id} = req.user;
    const {orderId} = req.params;
    const order = await Order.findById(orderId);
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
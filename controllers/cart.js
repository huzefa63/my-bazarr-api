import catchAsync from "../utils/catchAsync.js";
import Cart from "../models/cart.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const handleAddToCart = catchAsync(async (req, res, next) => {
  console.log("heyy");
  const { productId } = req.params;
  const { id } = req.user;
  await Cart.findOneAndUpdate(
    { user: id },
    { $addToSet: { items: productId } }
  );
  res.status(201).json({ message: "success" });
});

export const handleGetCartItems = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const cart = await Cart.findOne({ user: id }).populate({path:'items',populate:{path:'seller',ref:'User'}});
  res
    .status(201)
    .json({
      message: "success",
      cartItems: cart.items,
      totalItems: cart.items.length,
    });
});

export const handleDeleteCartItem = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;
  await Cart.findOneAndUpdate({ user: id }, { $pull: { items: productId } });
  res.status(200).json({ message: "success" });
});

export const handleCheckoutCart = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const {
    items,
    totalPrice,
    discount,
    deliveryCharges,
    finalPrice,
    address,
    email,
    phoneNumber,
  } = req.body;

  const ids = items.map(el => el.productId);
  const emailsOfSellers = items.map(el => el.sellerEmail);
  const IdsOfSellers = items.map(el => el.sellerId);

  const lineItemsData = items.map(el => {
    return {
      price_data: {
        currency: "inr",
        unit_amount: el.price * 100,
        product_data: {
          name: el.name,
          images: [el.coverImage],
          description: el.description,
        },
      },
      quantity: el.quantity,
    };
  })
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer:req.user.customerId,
    client_reference_id:id,
    shipping_address_collection:{
      allowed_countries:['IN']
    },
    phone_number_collection:{
      enabled:true
    },
    line_items: [
      ...lineItemsData,
      // Delivery fee (fixed)
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "_Delivery Fee",
          },
          unit_amount: deliveryCharges * 100, // 100 INR*100
        },
        quantity: 1,
      },
    ],
    discounts:[
        {coupon:'nMdPosp9'}
    ],
    metadata:{
      purchaseType:'multiple',
      productIds:JSON.stringify(ids),
      sellerEmails:JSON.stringify(emailsOfSellers),
      sellerIds:JSON.stringify(IdsOfSellers),
      shipping:deliveryCharges
    },
    success_url: `${process.env.ENVIROMENT === 'production' ? process.env.LOCAL_URL : process.env.URL}/app/purchases/orders`,
    cancel_url: `${process.env.ENVIROMENT === 'production' ? process.env.LOCAL_URL : process.env.URL}/app/purchases/cart`,
  });
  res.status(200).json({ message: "sucess",id:session.id });
});

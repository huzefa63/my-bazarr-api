import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import OtpRoutes from "./routes/otp.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import bodyParser from "body-parser";
import Stripe from "stripe";
import Order from "./models/order.js";
import Cart from "./models/cart.js";
import resend from "./libs/resend.js";
import sendOrderReceivedEmailToSeller, {
  sendOrderSuccessEmail,
} from "./helpers/email.js";
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Initialize Resend with API key from .env
app.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    res.json({ received: true });
    const signature = req.headers["stripe-signature"];
    let event;
    const stripeWebhookSecret =
      process.env.ENVIROMENT === "production"
        ? "whsec_8f33d935ec39593d50f1d0054ed021db9ef31e67788b4decc1aa6f9ab214098b"
        : process.env.STRIPE_WEBHOOK_SECRET;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.log(err);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // console.log(session);
      const line = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"],
      });

      const customerId = session.client_reference_id;
      const address = session.collected_information.shipping_details.address;
      const email = session.customer_details.email;
      const customerName = session.customer_details.name;
      const phoneNumber = session.customer_details.phone;
      const deliveryExpected = new Date();
      deliveryExpected.setDate(deliveryExpected.getDate() + 3);
      if (session.metadata.purchaseType === "multiple") {
        const productIds = JSON.parse(session.metadata.productIds);
        const productNames = line.data
          .filter((el) => !el.description.startsWith("_"))
          .map((el) => el.description);
        const sellerEmails = JSON.parse(session.metadata.sellerEmails);
        if (productIds?.length < 1) return;

        console.log(session.metadata.purchaseType);
        console.log(line.data);
        try {
          const promise = await Promise.all(
            line.data.map(async (el, i) => {
              if (!el.description.startsWith("_"))
                return await Order.create({
                  customer: customerId,
                  customerName,
                  email,
                  phoneNumber,
                  address,
                  productName: el.description,
                  product: productIds[i],
                  coverImage: el.price.product.images[0],
                  description: el.price.product.description,
                  deliveryCharges: Math.floor(
                    Number(session.metadata.shipping) / productIds.length
                  ),
                  subTotal: el.amount_subtotal / 100,
                  totalAmount: el.amount_total / 100,
                  discount: el.amount_discount / 100,
                  deliveryExpected,
                });
            })
          );
          console.log(promise);
          await Cart.updateOne(
            { user: session.client_reference_id },
            {
              $pullAll: { items: productIds },
            }
          );
          const order = {
            id: session.id,
            itemsLength: productIds.length,
            total: session.amount_total,
          };
          await sendOrderSuccessEmail(session.customer_details.email, order);
          await Promise.all(
            sellerEmails.map(async (email, i) => {
              return await sendOrderReceivedEmailToSeller(email, {
                id: session.id,
                customerName,
                productName: productNames[i],
              });
            })
          );
        } catch (err) {
          console.log(err);
        }
      }
      if(session.metadata.purchaseType === 'single'){
        try{
          await Order.create({
            customer: customerId,
            customerName,
            email,
            phoneNumber,
            address,
            productName: line.data[0].description,
            product: session.metadata.productId,
            coverImage: line.data[0].price.product.images[0],
            description: line.data[0].price.product.description,
            deliveryCharges: Math.floor(
              Number(session.metadata.shipping)
            ),
            subTotal: line.data[0].amount_subtotal / 100,
            totalAmount: line.data[0].amount_total / 100,
            discount: line.data[0].amount_discount / 100,
            deliveryExpected,
          });
          await Cart.updateOne(
            { user: session.client_reference_id },
            {
              $pullAll: { items: session.metadata.productId },
            }
          );
          await sendOrderSuccessEmail(session.customer_details.email, {
            id: session.id,
            itemsLength: 1,
            total: session.amount_total,
          });
         
    
               await sendOrderReceivedEmailToSeller(session.metadata.sellerEmail, {
                id: session.id,
                customerName,
                productName: line.data[0].description,
              });
          
       
        }catch(err){
          console.log(err);
        }
      }
    }
  }
);
app.use(
  cors({
    origin:
      process.env.ENVIROMENT === "production"
        ? "http://localhost:3000"
        : "https://www.my-bazarr.in",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// user routes

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/otp", OtpRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// res.cookie("randomCookie", randomValue, {
//   domain: ".my-bazarr.in", // makes cookie available on all subdomains
//   path: "/",
//   httpOnly: true,
//   secure: true, // frontend must be HTTPS
//   sameSite: "None", // required for cross-site
//   maxAge: 1000 * 60 * 60, // 1 hour
// }).status(200).send("hello");

export default app;

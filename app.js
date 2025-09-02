// import { config } from "dotenv";
// config({ path: "./.env" });

// // module imports
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// // // custom imports
// // import userRoutes from "./routes/user.js";
// // import transactionRoutes from "./routes/transaction.js";
// // import authRoutes from "./routes/auth.js";
// // import categoriesRoutes from "./routes/categories.js";
// // import globalErrorHandler from "./controllers/error.js";
// // import Transaction from "./models/transaction.js";
// // import { faker } from "@faker-js/faker";

// const app = express();

// app.use(
//   cors({ origin: "https://www.my-bazarr.in", credentials: true })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use('/',(req,res) => {
//   res.cookie( )
//     res.status(200).send('hello');
// })
// export default app;

import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Resend } from "resend";

const app = express();

// Initialize Resend with API key from .env
const resend = new Resend("re_SKvExRvV_M7SNB4V1CucyT4z6thjZyr9w");

app.use(cors({ origin: "https://www.my-bazarr.in", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route to set random cookie and send email
app.get("/", async (req, res) => {
  // Generate a random cookie value
  const randomValue = Math.random().toString(36).substring(2, 15);

  // Set cookie
  res.cookie("randomCookie", randomValue, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  // Send email via Resend
  try {
    await resend.emails.send({
      from: "hello@my-bazarr.in", // must be verified in Resend
      to: "huzefaratlam63@gmail.com", // replace with actual recipient
      subject: "Hello!",
      html: `<p>Hello! Your random cookie is: <strong>${randomValue}</strong></p>`,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }

  res.status(200).send("hello");
});

export default app;

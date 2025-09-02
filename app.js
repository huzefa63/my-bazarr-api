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
   

  // Send email via Resend
  try {
    await resend.emails.send({
      from: "My-Bazarr <hello@my-bazarr.in>", // Verified email
      to: 'huzefaratlam63@gmail.com',
      subject: "Welcome to My-Bazarr!",
      text: `Hello!\n\nYour random cookie value is: ${randomValue}\n\nThanks for visiting My-Bazarr!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color:#2c3e50;">Welcome to My-Bazarr!</h2>
          <p>Hello,</p>
          <p>Here is your random cookie value:</p>
          <p style="font-size:18px; font-weight:bold; color:#3498db;">${randomValue}</p>
          <hr />
          <p style="font-size:14px; color:#888;">
            You received this email because you visited My-Bazarr.<br />
            Contact us: <a href="mailto:support@my-bazarr.in">support@my-bazarr.in</a>
          </p>
        </div>
      `,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
res.cookie("randomCookie", "hello", {
  domain: ".my-bazarr.in", // makes cookie available on all subdomains
  path: "/",
  httpOnly: true,
  secure: true, // frontend must be HTTPS
  sameSite: "None", // required for cross-site
  maxAge: 1000 * 60 * 60, // 1 hour
}).status(200).send("hello");
});

export default app;

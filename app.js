import { config } from "dotenv";
config({ path: "./.env" });

// module imports
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Resend } from "resend";

import userRoutes from "./routes/user.js";
const app = express();

// Initialize Resend with API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({ origin: "https://www.my-bazarr.in", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// user routes

app.use('/user',userRoutes);

// Route to set random cookie and send email
app.get("/", async (req, res) => {
  // Generate a random cookie value
  const randomValue = Math.random().toString(36).substring(2, 15);

  // Set cookie
   

  // Send email via Resend
  try {
    await resend.emails.send({
      from: "My-Bazarr <hello@my-bazarr.in>", // must be a verified sender
      to: email, // user’s email
      subject: "Your My-Bazarr OTP Code",
      text: `Hello!\n\nYour OTP code is: ${otp}\n\nIt will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color:#2c3e50;">Verify Your Email</h2>
      <p>Hello,</p>
      <p>Your OTP code is:</p>
      <p style="font-size:22px; font-weight:bold; color:#3498db; letter-spacing: 3px;">
        ${otp}
      </p>
      <p style="margin-top: 15px;">This code will expire in <b>5 minutes</b>.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size:14px; color:#888;">
        If you did not request this OTP, you can safely ignore this email.<br />
        Need help? Contact us: 
        <a href="mailto:support@my-bazarr.in">support@my-bazarr.in</a>
      </p>
    </div>
  `,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
  }
res.cookie("randomCookie", randomValue, {
  domain: ".my-bazarr.in", // makes cookie available on all subdomains
  path: "/",
  httpOnly: true,
  secure: true, // frontend must be HTTPS
  sameSite: "None", // required for cross-site
  maxAge: 1000 * 60 * 60, // 1 hour
}).status(200).send("hello");
});

export default app;

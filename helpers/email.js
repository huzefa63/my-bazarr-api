import resend from "../libs/resend.js";
export async function sendOtpEmail(email, otp) {
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
}

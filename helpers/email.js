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

export async function sendOrderSuccessEmail(email,order){
    await resend.emails.send({
      from: "My-Bazarr <hello@my-bazarr.in>", // must be a verified sender
      to: email, // user’s email
      subject: `Your Order #${order.id} Confirmation 🎉`,
      text: `Thank you for your purchase! You bought ${order.itemsLength} item(s) for a total of ₹${order.total}.`,
      html: `
      <div style="font-family: sans-serif; padding: 20px; background: #f9fafb;">
        <div style="max-width: 480px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1)">
          <h2 style="color: #111827; text-align: center;">Thank you for your purchase 🎉</h2>
          <p style="color: #374151; text-align: center; margin: 6px 0;">
            We’ve received your order <strong>#${order.id}</strong>
          </p>

          <div style="margin-top: 20px; text-align: center; font-size: 16px; color: #111827;">
            <p><strong>${order.itemsLength}</strong> item(s) purchased</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
          </div>

          <p style="text-align: center; font-size: 12px; color: #6b7280; margin-top: 20px;">
            If you have any questions, reply to this email or contact support.
          </p>
        </div>
      </div>
    `,
    });
}
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  borough: z.string().min(1, "Borough is required"),
  listing_type: z.string().min(1, "Listing type is required"),
  request_details: z.string().optional(),
});

const orderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  borough: z.string().min(1, "Borough is required"),
  listing_type: z.string().min(1, "Listing type is required"),
  request_details: z.string().optional(),
  add_ons: z.array(z.string()),
  total_price: z.number(),
});

// Email template helpers
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
    ${content}
  </div>
</body>
</html>
`;

const emailHeader = (title: string) => `
<div style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #e4e4e7;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">${title}</h1>
</div>
`;

const emailBody = (content: string) => `
<div style="padding: 32px 40px;">
  ${content}
</div>
`;

const emailFooter = (text: string) => `
<div style="padding: 24px 40px; border-top: 1px solid #e4e4e7;">
  <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center;">${text}</p>
</div>
`;

app.post("/api/bookings", zValidator("json", bookingSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    // Save to database
    await c.env.DB.prepare(
      `INSERT INTO leads (name, email, phone, borough, listing_type, request_details)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        data.name,
        data.email,
        data.phone || null,
        data.borough,
        data.listing_type,
        data.request_details || null
      )
      .run();

    // Send email notification
    const emailContent = `
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Phone:</strong> ${data.phone}</p>` : ""}
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Borough:</strong> ${data.borough}</p>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Listing Type:</strong> ${data.listing_type}</p>
      ${data.request_details ? `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Request Details:</strong></p><p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">${data.request_details}</p>` : ""}
    `;

    const emailResult = await c.env.EMAILS.send({
      to: "luxentra.holdings@gmail.com",
      subject: `New Booking Request from ${data.name}`,
      html_body: emailTemplate(`
        ${emailHeader("New Booking Request")}
        ${emailBody(emailContent)}
        ${emailFooter("LuxEntra Media | Luxury Real Estate Media")}
      `),
      text_body: `New Booking Request\n\nName: ${data.name}\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ""}\nBorough: ${data.borough}\nListing Type: ${data.listing_type}${data.request_details ? `\nRequest Details: ${data.request_details}` : ""}`,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      return c.json(
        {
          success: false,
          error: "email_failed",
          message:
            "Your request was saved, but we couldn't send the email notification. Please contact us directly.",
        },
        500
      );
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Booking submission error:", error);
    return c.json({ success: false, error: "server_error" }, 500);
  }
});

app.post("/api/orders", zValidator("json", orderSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    // Save to database
    await c.env.DB.prepare(
      `INSERT INTO leads (name, email, phone, borough, listing_type, request_details)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(
        data.name,
        data.email,
        data.phone || null,
        data.borough,
        data.listing_type,
        `Order Details:\nTotal: $${data.total_price}\nAdd-ons: ${data.add_ons.length > 0 ? data.add_ons.join(", ") : "None"}\n\n${data.request_details || ""}`
      )
      .run();

    // Build add-ons list HTML
    const addOnsHtml = data.add_ons.length > 0
      ? `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Add-ons:</strong></p><ul style="margin: 0 0 16px 0; padding-left: 24px;">${data.add_ons.map(addon => `<li style="font-size: 16px; line-height: 24px; color: #3f3f46;">${addon}</li>`).join("")}</ul>`
      : `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Add-ons:</strong> None</p>`;

    const addOnsText = data.add_ons.length > 0
      ? `Add-ons:\n${data.add_ons.map(addon => `  - ${addon}`).join("\n")}`
      : "Add-ons: None";

    // Send email notification
    const emailContent = `
      <div style="background-color: #f4f4f5; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <h2 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #18181b;">$${data.total_price}</h2>
        <p style="margin: 0; font-size: 14px; color: #71717a;">Total Order Amount</p>
      </div>
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #18181b;">Package Details</h3>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Standard Listing Media Package:</strong> $175</p>
      ${addOnsHtml}
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #e4e4e7;" />
      <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #18181b;">Customer Information</h3>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Phone:</strong> ${data.phone}</p>` : ""}
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Borough:</strong> ${data.borough}</p>
      <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Listing Type:</strong> ${data.listing_type}</p>
      ${data.request_details ? `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;"><strong>Additional Details:</strong></p><p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46;">${data.request_details}</p>` : ""}
    `;

    const emailResult = await c.env.EMAILS.send({
      to: "luxentra.holdings@gmail.com",
      subject: `New Order: $${data.total_price} from ${data.name}`,
      html_body: emailTemplate(`
        ${emailHeader("New Order Received")}
        ${emailBody(emailContent)}
        ${emailFooter("LuxEntra Media | Luxury Real Estate Media")}
      `),
      text_body: `New Order Received\n\nTotal: $${data.total_price}\n\nPackage Details:\nStandard Listing Media Package: $175\n${addOnsText}\n\nCustomer Information:\nName: ${data.name}\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ""}\nBorough: ${data.borough}\nListing Type: ${data.listing_type}${data.request_details ? `\nAdditional Details: ${data.request_details}` : ""}`,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      return c.json(
        {
          success: false,
          error: "email_failed",
          message:
            "Your order was saved, but we couldn't send the email notification. Please contact us directly.",
        },
        500
      );
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Order submission error:", error);
    return c.json({ success: false, error: "server_error" }, 500);
  }
});

export default app;

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

// ---- Website chatbot (Cloudflare Workers AI, free tier) ----

const CHAT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const CHAT_FALLBACK_MODEL = "@cf/meta/llama-3.1-8b-instruct";

const CHAT_SYSTEM_PROMPT = `You are the website assistant for LuxEntra Media, a real estate photography, film, and personal branding company in New York City and Long Island. You talk to visitors on luxentramedia.com. Answer their questions and help them book or get a call back.

Our services and prices. Use only these. Never invent a price, a feature, or a service.
Listing Essentials, our standard package, $175: 25 to 45 MLS-ready photos, 1 twilight photo, 24-hour delivery, a private branded gallery, and free revisions.
Market Launch bundle, $399: premium interior and exterior photography, aerial drone photography, whole-property virtual staging, professionally edited listing-ready visuals, delivered ready for MLS, web, and social. Photography only, no film.
Listing Premiere bundle, $699: everything in Market Launch, plus a cinematic property film with professional editing, color, and music, interior, exterior, and aerial storytelling, optimized for websites and social media.
Agent Authority bundle, $899, our most chosen: everything in Listing Premiere, plus a personal branding video, so two films in total, plus complete creative production, a custom agent script, and guided on-camera direction.
Personal branding plans, monthly, 3-month minimum. Essential $3,999 a month: 10 short-form videos, 5 carousels, 15 stories, strategy, filming, editing, posting, and Instagram, Facebook, and TikTok management, with a monthly performance summary. Growth $5,999 a month: 15 videos, 10 carousels, 30 stories, everything in Essential, plus a lead-generation funnel, a lead-capture page, and paid-ad strategy and management. Premium $7,999 a month: 20 videos, 15 carousels, 60 stories, everything in Growth, plus advanced funnel and retargeting, continuous testing, lead nurturing, priority support, and a 50 percent money-back guarantee if the agreed performance benchmark is not achieved, subject to campaign terms. Brand Content $1,800 a month: 4 branding videos a month, strategy, scripting, filming, and editing, with 1 complimentary video in the first month.
We also do drone photos and video, 3D virtual tours, custom listing flyers, and virtual staging.
The public offer is WELCOME25, which gives $25 off a booking. Never mention any other discount code.

Booking and practical details.
Booking happens on the booking page at /order. There is no payment today. We confirm every booking by email within 24 hours.
Shoot bookings need at least 5 days of lead time before the shoot date.
Photos are delivered within 24 hours of the shoot.
We shoot across New York City and Long Island.
The free one-on-one consultation is also booked through /order. It is open to anyone.
When a visitor wants to book or be called back, help them take the next step: booking at /order, the free consultation, or a callback. Do not ask them for their name, phone number, or email. The chat asks for those on its own when needed.
Never claim to have the visitor's name, phone number, email, or contact info unless they shared it in this chat. If they have not shared it, do not say we will be in touch. Instead invite them to tap Leave my number below the chat and leave their name, phone number, and email, and we will call them back.

How to run the conversation: SPIN.
Every visitor is a chance to learn their problem, so collect their information first, before you give any answer.
Your first reply to any visitor question must be a question about their situation. Do not give prices, package details, or recommendations before you have asked. Ask at most two questions, then answer their question.
Ask one short question at a time, in plain words, like a person talking, never like a form or a checklist.
First, Situation: who are they and what is their situation. Are they an agent, a homeowner, a loan officer? What kind of property or brand are we talking about, and where?
Then, Problem: what is not working for them right now. Listings sitting, photos not doing the home justice, no leads from social media, no online presence.
Then, Implication: what is that costing them. A listing sitting means carrying costs and price cuts. No presence means competitors get the call.
Then, Need-payoff: what would it be worth to them if it were fixed. A faster sale, more leads, being the name people remember.
Only after you know their situation and problem, answer their question, and tie the answer to their problem.
Always end a recommendation with 2 or 3 numbered options matched to what they told you, each with its price, and ask them to pick one. The options must come from the catalog only. When they pick one, help them take the next step: booking at /order, the free consultation, or a callback.
If a visitor shares their name, phone number, or email in the chat, thank them. Their details are already saved, do not ask them to leave it again through Leave my number.

How to talk.
Write plainly, like a person. Keep replies short, two or three sentences, unless the visitor asks for detail. Never use dashes. Use we, never I.
Answer in the language the visitor writes in. If they write in Bangla, answer in Bangla.
If a visitor asks about a price or service that is not listed here, say you do not know, and offer the free one-on-one consultation or a callback.
Never make up prices, features, availability, or promises.`;

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1000),
});

const chatSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(12),
  visitor: z
    .object({
      name: z.string().min(1).max(100),
      email: z.string().max(150),
      phone: z.string().max(30),
    })
    .optional(),
});

const chatLeadSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(1, "Phone is required").max(30),
  email: z.string().email("Valid email is required").max(150),
  message: z.string().max(1000).optional(),
});

// Light per-IP throttle so one visitor cannot burn the free AI allowance.
const chatHits = new Map<string, { count: number; resetAt: number }>();
function chatRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = chatHits.get(ip);
  if (!entry || now > entry.resetAt) {
    chatHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 20;
}

app.post("/api/chat", zValidator("json", chatSchema), async (c) => {
  const ip =
    c.req.header("CF-Connecting-IP") ||
    c.req.header("x-forwarded-for") ||
    "unknown";
  if (chatRateLimited(ip)) {
    return c.json(
      {
        reply:
          "We are getting a lot of messages right now. Please try again in a minute, or leave your number below and we will call you back.",
      },
      429
    );
  }

  const { messages, visitor } = c.req.valid("json");
  const visitorNote = visitor
    ? `The visitor is ${visitor.name}. You already have their email (${visitor.email}) and phone number (${visitor.phone}). Use their first name naturally. Never ask for their contact info again.`
    : "You do not have the visitor's contact info yet.";
  const fullMessages = [
    { role: "system", content: `${CHAT_SYSTEM_PROMPT}\n\n${visitorNote}` },
    ...messages,
  ] as { role: "system" | "user" | "assistant"; content: string }[];

  const ask = async (model: string) => {
    const result = (await c.env.AI.run(model as never, {
      messages: fullMessages,
      max_tokens: 400,
      temperature: 0.3,
    })) as { response?: string };
    const reply = (result.response || "").trim();
    if (!reply) throw new Error("empty reply");
    return reply;
  };

  try {
    return c.json({ reply: await ask(CHAT_MODEL) });
  } catch (error) {
    console.error("Chat AI error (primary model):", error);
    try {
      return c.json({ reply: await ask(CHAT_FALLBACK_MODEL) });
    } catch (fallbackError) {
      console.error("Chat AI error (fallback model):", fallbackError);
      return c.json({
        reply:
          "Sorry, I am having trouble right now. You can book directly on the booking page, or leave your number below and we will call you back.",
      });
    }
  }
});

app.post("/api/chat/lead", zValidator("json", chatLeadSchema), async (c) => {
  const data = c.req.valid("json");

  // Leads go to the same orders sheet as every other lead on the site,
  // through the Google Apps Script endpoint the booking page and the
  // lead-capture popup already use. (The D1 database and email bindings
  // this file's bookings/orders endpoints expect were never connected in
  // the deployed worker, so this handler does not touch them.)
  // Mirrors ORDERS_ENDPOINT in src/react-app/lib/siteSettings.tsx.
  const ORDERS_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbynyupNugdxjc7EAAUK1e9c9JS79VccnuwHc8ar81Q6-v_ug8EOhbDgNZXeqhFyRcM46A/exec";

  try {
    const res = await fetch(ORDERS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        form_type: "lead",
        name: data.name,
        email: data.email,
        phone: data.phone,
        brokerage: "Chatbot",
        discount_code: "WELCOME25",
        request_details: data.message || "",
      }),
    });
    if (!res.ok) throw new Error(`orders endpoint ${res.status}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Chat lead error:", error);
    return c.json({ success: false, error: "server_error" }, 500);
  }
});

export default app;

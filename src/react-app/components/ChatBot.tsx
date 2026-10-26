import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { MessageCircle, Send, X } from "lucide-react";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const STORAGE_KEY = "luxentra-chat-v1";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hey, welcome to LuxEntra. Ask me anything about our packages, pricing, or booking a shoot. Want us to call you back? Tap Leave my number below.",
};

const QUICK_CHIPS: { label: string; message?: string; action?: "lead" }[] = [
  { label: "What are your prices?", message: "What are your prices?" },
  { label: "Book a shoot", message: "I want to book a shoot" },
  { label: "Free consultation", message: "Tell me about the free consultation" },
  { label: "Personal branding", message: "Tell me about personal branding" },
  { label: "Leave my number", action: "lead" },
];

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [GREETING];
    return parsed.slice(-20);
  } catch {
    return [GREETING];
  }
}

/** Turns /order, /consultation, /branding, /work and full URLs into links. */
function renderWithLinks(text: string) {
  const parts = text.split(
    /((?:https?:\/\/[^\s]+)|\/(?:order|consultation|branding|work)\b[^\s]*)/g
  );
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 break-all"
        >
          {part}
        </a>
      );
    }
    if (/^\/(?:order|consultation|branding|work)\b/.test(part)) {
      return (
        <a key={i} href={part} className="underline underline-offset-2">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatBot() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadNeed, setLeadNeed] = useState("");
  const [leadSending, setLeadSending] = useState(false);
  const [leadError, setLeadError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // Storage unavailable, chat still works for this visit.
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, showLeadForm]);

  // Hidden on the backstage admin page.
  if (pathname.startsWith("/backstage")) return null;

  async function sendChat(history: ChatMessage[]) {
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Sorry, I am having trouble right now. You can book directly on the booking page, or leave your number below and we will call you back.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I am having trouble right now. You can book directly on the booking page, or leave your number below and we will call you back.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function sendUserMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    void sendChat(next);
  }

  async function submitLead() {
    const name = leadName.trim();
    const phone = leadPhone.trim();
    const email = leadEmail.trim();
    if (!name || (!phone && !email)) {
      setLeadError("Add your name and a phone number or an email.");
      return;
    }
    setLeadError("");
    setLeadSending(true);
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone || undefined,
          email: email || undefined,
          message: leadNeed.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (!res.ok || !data.success) throw new Error("lead failed");
      setShowLeadForm(false);
      setLeadName("");
      setLeadPhone("");
      setLeadEmail("");
      setLeadNeed("");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Thanks ${name}, we have your details. We will call you back shortly.`,
        },
      ]);
    } catch {
      setLeadError("Something went wrong. Please try again.");
    } finally {
      setLeadSending(false);
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[100] flex h-[520px] max-h-[calc(100vh-120px)] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60 sm:right-5">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7ff00] text-sm font-bold text-black">
                L
              </span>
              <div>
                <p className="text-sm font-semibold text-white">LuxEntra</p>
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c7ff00]" />
                  Online, replies within a day
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "self-end bg-[#c7ff00] text-black"
                      : "self-start bg-white/10 text-white"
                  }`}
                >
                  {m.role === "assistant" ? renderWithLinks(m.content) : m.content}
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-1.5 self-start rounded-2xl bg-white/10 px-3.5 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/50" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/50 [animation-delay:300ms]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {showLeadForm ? (
            <div className="border-t border-white/10 px-4 py-3">
              <p className="mb-2 text-sm font-medium text-white">
                Leave your number and we will call you back.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#c7ff00] focus:outline-none"
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="Phone number"
                  inputMode="tel"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#c7ff00] focus:outline-none"
                />
                <input
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email (optional)"
                  inputMode="email"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#c7ff00] focus:outline-none"
                />
                <input
                  value={leadNeed}
                  onChange={(e) => setLeadNeed(e.target.value)}
                  placeholder="What do you need? (optional)"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#c7ff00] focus:outline-none"
                />
                {leadError && <p className="text-xs text-red-400">{leadError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void submitLead()}
                    disabled={leadSending}
                    className="flex-1 rounded-lg bg-[#c7ff00] px-3 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:opacity-50"
                  >
                    {leadSending ? "Sending..." : "Get a call back"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLeadForm(false)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      if (chip.action === "lead") {
                        setShowLeadForm(true);
                      } else if (chip.message) {
                        sendUserMessage(chip.message);
                      }
                    }}
                    className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:border-[#c7ff00]/60 hover:text-white"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendUserMessage(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about packages, pricing, booking..."
                  aria-label="Message LuxEntra"
                  className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[#c7ff00] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={sending || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c7ff00] text-black transition hover:brightness-110 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        aria-label={open ? "Close chat" : "Chat with LuxEntra"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#c7ff00] text-black shadow-lg shadow-black/40 transition hover:brightness-110 sm:right-5"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}

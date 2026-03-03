import type { EmailService } from "@/shared/types";

declare global {
  interface Env {
    DB: D1Database;
    EMAILS: EmailService;
  }
}

export {};

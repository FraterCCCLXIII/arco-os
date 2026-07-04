import type { IconName } from "../../../icons";

export type TicketsView =
  | "dashboard"
  | "inbox"
  | "notification"
  | "ticket"
  | "knowledge-base"
  | "customer"
  | "forum"
  | "report";

export type TicketStatus = "new" | "in-progress" | "awaiting-customer" | "closed" | "draft";
export type TicketPriority = "urgent" | "medium" | "low";
export type TicketType = "incident" | "problem" | "question" | "suggestion";

export interface TicketsNavItem {
  id: string;
  label: string;
  icon: IconName;
  view: TicketsView;
  badge?: string;
}

export interface TicketsConversationItem {
  id: string;
  label: string;
  icon: IconName;
  meta?: string;
  badge?: string;
}

export interface TicketsPinnedItem {
  id: string;
  label: string;
  meta?: string;
}

export interface TicketMetric {
  id: string;
  label: string;
  value: number;
  trend: number;
  status: TicketStatus;
}

export interface Ticket {
  id: string;
  displayId: string;
  priority: TicketPriority;
  subject: string;
  intent: string;
  type: TicketType;
  status: TicketStatus;
  clientName: string;
  clientEmail: string;
  raisedAt: string;
  raisedAtMs: number;
  pinned?: boolean;
}

export interface TicketsWorkspaceData {
  productName: string;
  userRole: string;
  userName: string;
  userEmail: string;
  navItems: TicketsNavItem[];
  conversationItems: TicketsConversationItem[];
  pinnedTickets: TicketsPinnedItem[];
  metrics: TicketMetric[];
  automationCount: number;
  tickets: Ticket[];
}

export function filterTickets(
  tickets: Ticket[],
  options: {
    status?: TicketStatus | "all";
    priority?: TicketPriority | "all";
    type?: TicketType | "all";
    query?: string;
  } = {},
): Ticket[] {
  const normalizedQuery = options.query?.trim().toLowerCase() ?? "";

  return tickets.filter((ticket) => {
    if (options.status && options.status !== "all" && ticket.status !== options.status) return false;
    if (options.priority && options.priority !== "all" && ticket.priority !== options.priority) return false;
    if (options.type && options.type !== "all" && ticket.type !== options.type) return false;

    if (!normalizedQuery) return true;

    return (
      ticket.displayId.toLowerCase().includes(normalizedQuery) ||
      ticket.subject.toLowerCase().includes(normalizedQuery) ||
      ticket.intent.toLowerCase().includes(normalizedQuery) ||
      ticket.clientName.toLowerCase().includes(normalizedQuery) ||
      ticket.clientEmail.toLowerCase().includes(normalizedQuery)
    );
  });
}

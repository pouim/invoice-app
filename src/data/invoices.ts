import { Status } from "@/db/schema";

export const AVAILABLE_STATUSES = [
  {
    id: "open",
    label: "Open",
  },
  {
    id: "paid",
    label: "Paid",
  },
  {
    id: "void",
    label: "Void",
  },
  {
    id: "uncollectible",
    label: "Uncollectible",
  },
];

export const statusColors: Record<Status, string> = {
  open: "bg-blue-500",
  paid: "bg-green-600",
  void: "bg-zinc-700",
  uncollectible: "bg-red-600",
};

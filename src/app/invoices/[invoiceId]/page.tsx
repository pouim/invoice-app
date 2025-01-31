import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Invoice({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = await auth();
  if (!userId) return;

  const invoiceId = +params.invoiceId;

  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  if (!invoice) {
    notFound();
  }

  const statusColors = {
    open: "bg-blue-500",
    paid: "bg-green-600",
    void: "bg-zinc-700",
    uncollectible: "bg-red-600",
  };

  return (
    <main className="flex flex-col justify-center h-full gap-6 max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold flex items-center gap-2">
        Invoice {invoice.id}
        <Badge
          className={clsx(
            "rounded-full px-3 py-1 text-sm font-medium",
            statusColors[invoice.status]
          )}
        >
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </h1>

      <p className="text-2xl font-semibold">
        $ {(invoice.value / 100).toFixed(2)}
      </p>
      <p className="text-gray-600">{invoice.description}</p>

      <h2 className="text-lg font-semibold mt-4">Billing Details</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableHead className="text-left p-4">Invoice ID</TableHead>
            <TableCell className="text-left p-4">{invoice.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-left p-4">Invoice Date</TableHead>
            <TableCell className="text-left p-4">
              {new Date(invoice.createTs).toDateString()}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-left p-4">Billing Name</TableHead>
            <TableCell className="text-left p-4">Pouyan Ahmadpour</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-left p-4">Billing Email</TableHead>
            <TableCell className="text-left p-4">
              ahmadpour.pouyan@gmail.com
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}

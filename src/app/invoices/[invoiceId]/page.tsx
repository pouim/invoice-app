import { db } from "@/db";
import { Invoices, Status } from "@/db/schema";
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
import Container from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction } from "@/actions";
import { ChevronDown } from "lucide-react";

export default async function Invoice({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = await auth();
  if (!userId) return;

  const invoiceId = parseInt(params.invoiceId);

  if (isNaN(invoiceId)) {
    throw new Error("Invalid invoice ID");
  }

  const [invoice] = await db
    .select()
    .from(Invoices)
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  if (!invoice) {
    notFound();
  }

  const statusColors: Record<Status, string> = {
    open: "bg-blue-500",
    paid: "bg-green-600",
    void: "bg-zinc-700",
    uncollectible: "bg-red-600",
  };

  return (
    <main className=" w-full h-full">
      <Container className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                Change Status
                <ChevronDown className="w-4 h-auto" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
              {AVAILABLE_STATUSES.map((status) => (
                <DropdownMenuItem key={status.id}>
                  <form action={updateStatusAction} className="w-full p-1">
                    <input type="hidden" name="id" value={invoiceId} />
                    <input type="hidden" name="status" value={status.id} />
                    <button className="w-full text-left">{status.label}</button>
                  </form>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
      </Container>
    </main>
  );
}

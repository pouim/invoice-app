import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import clsx from "clsx";
import { statusColors } from "@/data/invoices";

export default async function Dashboard() {
  const { userId, orgId } = await auth();
  if (!userId) return;

  let results;

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  const invoices = results.map(({ invoices, customers }) => ({
    ...invoices,
    customer: customers,
  }));

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <Button asChild variant="ghost" className="inline-flex gap-2">
            <Link href="/invoices/new">
              <CirclePlus className="h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-left p-4">Date</TableHead>
              <TableHead className="text-left p-4">Customer</TableHead>
              <TableHead className="text-left p-4">Email</TableHead>
              <TableHead className="text-center p-4">Status</TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map(({ id, createTs, value, status, customer }) => (
              <TableRow key={id}>
                <TableCell className="text-left font-medium p-4">
                  <Link href={`/invoices/${id}`} className="font-semibold">
                    {new Date(createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-4">
                  <Link href={`/invoices/${id}`} className="font-semibold">
                    {customer.name}
                  </Link>
                </TableCell>
                <TableCell className="text-left p-4">
                  <Link href={`/invoices/${id}`}>{customer.email}</Link>
                </TableCell>
                <TableCell className="text-center p-4">
                  <Link href={`/invoices/${id}`}>
                    <Badge
                      className={clsx(
                        "rounded-full px-3 py-1 text-sm font-medium",
                        statusColors[status]
                      )}
                    >
                      {status}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="text-right p-4">
                  <Link href={`/invoices/${id}`} className="font-semibold">
                    {" "}
                    $ {(value / 100).toFixed(2)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}

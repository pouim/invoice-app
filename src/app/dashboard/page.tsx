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
import { Invoices } from "@/db/schema";

export default async function Dashboard() {
  const results = await db.select().from(Invoices);

  return (
    <main className="flex flex-col justify-center h-full gap-6 text-center max-w-5xl mx-auto">
      <div className="flex justify-between">
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
          {results.map(({ id, createTs, value, status }) => (
            <TableRow key={id}>
              <TableCell className="text-left font-medium p-4">
                <Link href={`/invoices/${id}`} className="font-semibold">
                  {new Date(createTs).toLocaleDateString()}
                </Link>
              </TableCell>
              <TableCell className="text-left p-4">
                <Link href={`/invoices/${id}`} className="font-semibold">
                  Pouyan Ahmadpour
                </Link>
              </TableCell>
              <TableCell className="text-left p-4">
                <Link href={`/invoices/${id}`}>ahmadpour.pouyan@gmail.com</Link>
              </TableCell>
              <TableCell className="text-center p-4">
                <Link href={`/invoices/${id}`}>
                  <Badge className="rounded-full">{status}</Badge>
                </Link>
              </TableCell>
              <TableCell className="text-right p-4">
                <Link href={`/invoices/${id}`} className="font-semibold">
                  $ {(value / 100).toFixed(2)}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

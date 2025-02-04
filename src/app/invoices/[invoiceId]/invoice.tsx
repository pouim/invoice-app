/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { deleteInvoiceAction, updateStatusAction } from "@/actions";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { Invoices, Status } from "@/db/schema";
import clsx from "clsx";
import { ChevronDown, Ellipsis, Trash2 } from "lucide-react";
import { useOptimistic } from "react";

const statusColors: Record<Status, string> = {
  open: "bg-blue-500",
  paid: "bg-green-600",
  void: "bg-zinc-700",
  uncollectible: "bg-red-600",
};

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect;
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => String(newStatus)
  );

  const handleOnUpdateStatus = async (formData: FormData) => {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));

    try {
      await updateStatusAction(formData);
    } catch (e) {
      setCurrentStatus(originalStatus);
    }
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
                statusColors[currentStatus]
              )}
            >
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </Badge>
          </h1>
          <div className="flex items-center gap-4">
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
                    <form action={handleOnUpdateStatus} className="w-full p-1">
                      <input type="hidden" name="id" value={invoice.id} />
                      <input type="hidden" name="status" value={status.id} />
                      <button className="w-full text-left">
                        {status.label}
                      </button>
                    </form>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2" variant="outline">
                    <span className="sr-only">More Options</span>
                    <Ellipsis className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2">
                        <Trash2 className="w-4 h-auto" />
                        Delete Invoice
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader className="gap-4">
                  <DialogTitle>Delete Invoice?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                  <DialogFooter>
                    <form action={deleteInvoiceAction} className="w-full p-1">
                      <input type="hidden" name="id" value={invoice.id} />
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-auto" />
                        Delete Invoice
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
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

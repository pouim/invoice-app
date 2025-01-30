import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col justify-center h-full text-center max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-red-500">Invoice Not Found</h1>
      <Button color="secondary" asChild className="max-w-xs mx-auto">
        <Link href="/dashboard">Go back to dashboard</Link>
      </Button>
    </main>
  );
}

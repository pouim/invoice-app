import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function Container({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div {...props} className={cn("max-w-5xl mx-auto px-5", className)}>
      {children}
    </div>
  );
}

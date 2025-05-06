import { cn } from "@/lib/utils";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      style={{ padding: 0 }}
      className={cn("container mx-auto px-4 md:px-8 w-full", className)}
    >
      {children}
    </div>
  );
};

export default Container;

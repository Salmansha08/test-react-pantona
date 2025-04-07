"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

export const BackHomeButton = () => {
  const router = useRouter();

  return (
    <>
      <Button
        variant="outline"
        className={cn("w-full", "flex items-center gap-2")}
        onClick={() => router.back()}
      >
        <MoveLeft className="w-4 h-4" /> Back
      </Button>
    </>
  );
};

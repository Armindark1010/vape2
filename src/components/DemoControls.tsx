"use client";

import { useStore } from "@/store/store";
import { Button } from "@/components/ui";
import { IcClose } from "@/components/icons";

export function DemoControls() {
  const { toast } = useStore();
  return (
    <Button
      variant="danger"
      size="sm"
      onClick={() =>
        toast({
          title: "Signed out (demo)",
          body: "This demo session uses a local profile — no real authentication.",
          kind: "info",
        })
      }
    >
      <IcClose size={13} /> Sign out
    </Button>
  );
}

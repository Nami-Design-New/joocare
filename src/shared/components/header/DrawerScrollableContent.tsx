"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { X } from "lucide-react";
import NotificationCard from "../NotificationCard";

export function DrawerScrollableContent({
  title,
  open,
  onOpenChange,
}: {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white">
        <DrawerHeader className="d-flex flex-row items-center justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          <Button
            variant="outline"
            className="border-0"
            size="icon-lg"
            onClick={() => onOpenChange(false)}
          >
            <X />{" "}
          </Button>
        </DrawerHeader>
        <div className="no-scrollbar z-10 overflow-y-auto px-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <NotificationCard key={index} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

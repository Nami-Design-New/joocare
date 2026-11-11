'use client';

import * as React from 'react';
import { ChevronDownIcon, Minus, Plus } from 'lucide-react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/shared/lib/utils';

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('border-b', className)}
      {...props}
    />
  );
}

type IconType = 'plus-minus' | 'arrow' | 'circle-arrow';

function AccordionTrigger({
  className,
  children,
  iconType = 'plus-minus', // default value
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  iconType?: IconType;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        {/* <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" /> */}
        {/* <div className="bg-secondary ml-4 flex size-7 shrink-0 items-center justify-center rounded-full">
          <Plus className="h-4 w-4 text-white group-data-[state=open]:hidden" />
          <Minus className="hidden h-4 w-4 text-white group-data-[state=open]:block" />
        </div> */}

        {/* ICON */}
        {iconType === 'plus-minus' && (
          <div className="ml-4 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Plus className="h-4 w-4 text-white group-data-[state=open]:hidden" />
            <Minus className="hidden h-4 w-4 text-white group-data-[state=open]:block" />
          </div>
        )}

        {iconType === 'arrow' && (
          <ChevronDownIcon className="pointer-events-none size-6 shrink-0 translate-y-0.5 font-bold text-black transition-transform duration-200 group-data-[state=open]:rotate-180" />
        )}

        {/* Chevron in a 36px grey circle (post-job section cards). */}
        {iconType === 'circle-arrow' && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <ChevronDownIcon className="pointer-events-none size-5 text-foreground transition-transform duration-200 in-data-[state=open]:rotate-180" />
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pt-0 pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

"use client";

// components/contact/ContactForm.tsx

import { Button } from "@/shared/components/ui/button";
import SectionTitle from "../home/components/SectionTitle";
import { RenderField } from "./RenderField";

type FieldType = "input" | "select" | "textarea" | "phone" | "location";

interface Field {
  type: FieldType;
  label?: string;
  placeholder?: string;
}

export default function ContactForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const fields: Field[] = isLoggedIn
    ? [
        { type: "input", label: "company name", placeholder: "ex: JooCare" },
        { type: "input", label: "Email", placeholder: "ex:mail@mail.com" },
        { type: "phone" },
        { type: "location" },
        { type: "select", label: "Type of inquiry" },
        { type: "textarea" },
      ]
    : [
        { type: "input", label: "Full Name", placeholder: "ex: Ahmed eltawy" },
        { type: "input", label: "Email", placeholder: "ex:mail@mail.com" },
        { type: "select", label: "Type of inquiry" },
        { type: "textarea" },
      ];

  return (
    <div className="h-full">
      <SectionTitle sectionTitle="REQUEST FOR DEMO" />

      <h2 className="text-secondary my-4 text-2xl font-bold">
        Send your message
      </h2>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {fields.map((field, index) => (
          <RenderField key={index} field={field} />
        ))}

        <Button
          type="submit"
          variant="secondary"
          size="pill"
          hoverStyle="slidePrimary"
          className="w-full justify-center"
        >
          Send
        </Button>
      </form>
    </div>
  );
}

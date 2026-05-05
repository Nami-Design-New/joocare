"use client";
import { ArrowUp } from "lucide-react";
export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToTop}
      className="absolute right-4 bottom-4 cursor-pointer p-2 transition-all text-white border border-white rounded-full"
      aria-label="Scroll to top"
    >
      <ArrowUp size={28} />
    </button>
  );
}

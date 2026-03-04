"use client";
import { ArrowUp } from "lucide-react";
export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 cursor-pointer right-8 md:absolute md:bottom-8 md:right-4 bg-[#28A745] hover:bg-green-600 p-3 rounded-lg transition-all shadow-lg"
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
}

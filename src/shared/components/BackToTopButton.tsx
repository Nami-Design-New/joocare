'use client';
import { ArrowUp } from 'lucide-react';
export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <button
      onClick={scrollToTop}
      className="cursor-pointer rounded-full border border-white p-1.5 text-white transition-all md:p-2"
      aria-label="Scroll to top"
    >
      <ArrowUp size={28} className="size-5 md:size-7" />
    </button>
  );
}

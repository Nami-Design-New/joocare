"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface MultiSelectInputSkillsProps {
  selected: string[];
  onSelect: (skillId: string) => void;
  onRemove: (skillId: string) => void;
  options: {
    id: string;
    label: string;
  }[];
  onReachEnd?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
}

export function MultiSelectInputSkills({
  selected,
  onSelect,
  onRemove,
  options,
  onReachEnd,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: MultiSelectInputSkillsProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hasWrappedContent, setHasWrappedContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const selectedLabels = selected
    .map((selectedId) => options.find((option) => option.id === selectedId)?.label ?? selectedId);

  const filtered = options.filter(
    (option) =>
      option.label.toLowerCase().includes(query.toLowerCase()) && !selected.includes(option.id),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const element = fieldRef.current;

    if (!element) {
      return;
    }

    const updateWrappingState = () => {
      setHasWrappedContent(element.offsetHeight > 52);
    };

    updateWrappingState();

    const observer = new ResizeObserver(updateWrappingState);
    observer.observe(element);

    return () => observer.disconnect();
  }, [selected, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [open]);

  const handleObserver = (node: HTMLLIElement | null) => {
    if (isFetchingNextPage) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onReachEnd?.();
        }
      },
      {
        root: listRef.current,
        rootMargin: "100px",
      },
    );

    if (node) observerRef.current.observe(node);
  };

  const handleSelect = (skillId: string) => {
    onSelect(skillId);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={fieldRef}
        className={`flex min-h-[44px] flex-wrap gap-1.5 border border-border bg-muted px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${
          hasWrappedContent ? "items-start rounded-2xl py-3" : "items-center rounded-full py-2"
        }`}
        onClick={() => setOpen(true)}
      >
        {selected.map((skillId) => (
          <span
            key={skillId}
            className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs text-white"
          >
            {options.find((option) => option.id === skillId)?.label ?? skillId}
            <X
              size={12}
              className="cursor-pointer hover:opacity-70"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(skillId);
              }}
            />
          </span>
        ))}
        <input
          className="min-w-[140px] flex-1 bg-transparent text-sm text-secondary outline-none placeholder:text-muted-foreground"
          placeholder={selectedLabels.length === 0 ? "ex: consultant cardiologist" : ""}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
        />
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          } ${hasWrappedContent ? "mt-1 self-start" : ""}`}
        />
      </div>

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {filtered.map((skill) => (
            <li
              key={skill.id}
              className="cursor-pointer px-4 py-2 text-sm text-secondary transition hover:bg-[#09760A10] hover:text-primary"
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(skill.id);
              }}
            >
              {skill.label}
            </li>
          ))}

          {(hasNextPage || isFetchingNextPage) && (
            <li ref={handleObserver} className="h-1" />
          )}

          {(isLoading || isFetchingNextPage) && (
            <li className="text-muted-foreground px-4 py-2 text-xs">Loading...</li>
          )}

          {!isLoading && filtered.length === 0 && !isFetchingNextPage && (
            <li className="text-muted-foreground px-4 py-2 text-xs">
              No results found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

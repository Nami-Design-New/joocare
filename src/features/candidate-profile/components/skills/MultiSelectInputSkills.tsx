
'use client'

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"

interface MultiSelectInputSkillsProps {
    selected: string[]
    onSelect: (skill: string) => void
    onRemove: (skill: string) => void
    options: string[]
}

export function MultiSelectInputSkills({ selected, onSelect, onRemove, options }: MultiSelectInputSkillsProps) {
    const [query, setQuery] = useState("")
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const filtered = options.filter(
        (o) =>
            o.toLowerCase().includes(query.toLowerCase()) &&
            !selected.includes(o)
    )

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (skill: string) => {
        onSelect(skill)
        setQuery("")
        setOpen(false)
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Input box */}
            <div
                className="flex items-center flex-wrap gap-1.5 min-h-[44px] border border-border  px-3 py-2 cursor-text bg-muted  rounded-full focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition"
                onClick={() => setOpen(true)}
            >
                {selected.map((skill) => (
                    <span
                        key={skill}
                        className="flex items-center gap-1.5 bg-primary text-white text-xs px-2.5 py-1 rounded-full"
                    >
                        {skill}
                        <X
                            size={12}
                            className="cursor-pointer hover:opacity-70"
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove(skill)
                            }}
                        />
                    </span>
                ))}
                <input
                    className="flex-1 min-w-[140px] outline-none text-sm text-secondary placeholder:text-muted-foreground bg-transparent"
                    placeholder={selected.length === 0 ? "ex: consultant cardiologist" : ""}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setOpen(true)
                    }}
                // onFocus={() => setOpen(true)}
                />
                <ChevronDown
                    size={16}
                    className={`text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
            </div>

            {/* Dropdown */}
            {open && filtered.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-y-auto py-1">
                    {filtered.map((skill) => (
                        <li
                            key={skill}
                            className="px-4 py-2 text-sm text-secondary hover:bg-[#09760A10] hover:text-primary cursor-pointer transition"
                            onMouseDown={(e) => {
                                e.preventDefault()
                                handleSelect(skill)
                            }}
                        >
                            {skill}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

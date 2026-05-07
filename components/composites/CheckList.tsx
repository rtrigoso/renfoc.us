'use client';

import { useEffect, useState } from "react";
import CheckItem from "@/components/CheckItem";

interface CheckListProps {
    prefix: string;
    items: string[];
}

export default function CheckList({ prefix, items }: CheckListProps) {
    const storageKey = `checklist-${prefix}`;
    const [checked, setChecked] = useState<Set<string>>(new Set());

    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) setChecked(new Set(JSON.parse(stored)));
        } catch { /* ignore */ }
    }, [storageKey]);

    function toggle(id: string) {
        setChecked(prev => {
            const next = new Set(prev);
            if (next.has(id)) { next.delete(id); } else { next.add(id); }
            try { localStorage.setItem(storageKey, JSON.stringify([...next])); } catch { /* ignore */ }
            return next;
        });
    }

    return (
        <ul className="checklist">
            {items.map((item, i) => {
                const id = `${prefix}-${i}`;
                return (
                    <CheckItem
                        key={id}
                        id={id}
                        label={item}
                        checked={checked.has(id)}
                        onChange={toggle}
                    />
                );
            })}
        </ul>
    );
}

'use client';

export const CLEAR_EVENT = 'storage:clear';

interface ClearButtonProps {
    prefix: string;
}

export default function ClearButton({ prefix }: ClearButtonProps) {
    function handleClick() {
        Object.keys(localStorage)
            .filter(k => k.startsWith(prefix))
            .forEach(k => localStorage.removeItem(k));
        window.dispatchEvent(new CustomEvent(CLEAR_EVENT, { detail: { prefix } }));
    }

    return <button onClick={handleClick}>clear</button>;
}

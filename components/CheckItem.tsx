'use client';

interface CheckItemProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (id: string) => void;
}

export default function CheckItem({ id, label, checked, onChange }: CheckItemProps) {
    return (
        <li>
            <label htmlFor={id}>
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={() => onChange(id)}
                />
                <span>{label}</span>
            </label>
        </li>
    );
}

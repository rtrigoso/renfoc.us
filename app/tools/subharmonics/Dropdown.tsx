import styles from './subharmonics.module.css';

export interface DropdownOption {
    label: string;
    value: string;
}

type OnChangeCallback = (value: string) => void;

interface DropdownProps {
    id: string;
    label: string;
    options: DropdownOption[];
    onChange?: OnChangeCallback
}

export default function Dropdown({ id, options, label, onChange }: DropdownProps) {
    return (
        <>
            <label className={styles.label} htmlFor={id}>{label}</label>
            <select id={id} onChange={e => onChange && onChange(e.target.value || '')} >
                {
                    options.map(({ label, value }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
            </select>
        </>
    );
}

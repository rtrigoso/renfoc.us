import { ICON_COLOR } from "@/utils/config";

export default function RSSIcon() {
    return (
        <svg aria-hidden={true} role="img" width="1.25rem" height="1.25rem" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color={ICON_COLOR}>
            <path d="M12 17C12 14 10 12 7 12" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M17 17C17 11 13 7 7 7" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M7 17.01L7.01 16.9989" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    );
}

export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatTagLabel(tag: string): string {
    return tag.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

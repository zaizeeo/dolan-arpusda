export function capitalizeText(text: string): string {
    return text.slice(0, 1).toUpperCase() + text.slice(1);
}

export function getInitials(name: string): string {
    const initials = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");

    return initials || "?";
}

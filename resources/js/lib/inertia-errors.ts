/**
 * Resolve a human readable message from an Inertia error bag.
 *
 * Laravel validation errors arrive as strings per field, while this project
 * also exposes a `server` key that is sent as an array of strings.
 */
export function resolveInertiaErrorMessage(errors: Record<string, unknown> | null | undefined, fallback = "Coba lagi beberapa saat"): string {
    if (!errors) {
        return fallback;
    }

    const candidates = [errors.server, ...Object.values(errors)];

    for (const candidate of candidates) {
        const value = Array.isArray(candidate) ? candidate[0] : candidate;

        if (typeof value === "string" && value.trim().length > 0) {
            return value;
        }
    }

    return fallback;
}

/**
 * Normalize a single Inertia error value into a string.
 */
export function resolveInertiaFieldError(value: unknown): string | null {
    const normalized = Array.isArray(value) ? value[0] : value;

    if (typeof normalized === "string" && normalized.trim().length > 0) {
        return normalized;
    }

    return null;
}

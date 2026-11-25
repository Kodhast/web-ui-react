/** Joins class names, skipping the empty ones. */
export function cx(...names) {
    return names.filter(Boolean).join(' ');
}

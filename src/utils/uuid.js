export function generateUUID() {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

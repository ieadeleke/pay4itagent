
export function isEmail(email: string): boolean {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isUrl(url: string): boolean {
    const urlRegex: RegExp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    return urlRegex.test(url);
}

export function validateUsername(username: string): boolean {
    return (/^[a-z0-9-]*$/.test(username.trim().toLowerCase())) && username.trim().length >= 3 && username.trim().length <= 20
}

export function validateName(name: string): boolean {
    return (/^[a-zA-Z0-9 -]*$/.test(name.trim())) && name.trim().length >= 1 && name.trim().length <= 50
}
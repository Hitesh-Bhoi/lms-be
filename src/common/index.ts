// email validation regex
export const emailRegx: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// phone validation regex
export const phoneRegx: RegExp = /^\+?[1-9]\d{9,14}$/;
// function to validate email
export const isValidEmail = (email: string): boolean => {
    return emailRegx.test(email);
};
// function to normalize phone
export const normalizePhone = (phone: string): string => {
    return phone.replace(/[\s\-\(\)]/g, '');
};
// function to validate phone
export const isValidPhone = (phone: string): boolean => {
    const cleanPhone = normalizePhone(phone);
    return phoneRegx.test(cleanPhone);
};
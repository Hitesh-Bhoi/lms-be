// email validation regex
export const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// phone validation regex
export const phoneRegx = /^\+?[1-9]\d{9,14}$/;

// function to validate email
export const isValidEmail = (email: string) => {
    return emailRegx.test(email)
};

// function to normalize phone
export const normalizePhone = (phone: string) => {
    return phone.replace(/[\s\-\(\)]/g, '');
};

// function to validate phone
export const isValidPhone = (phone: string) => {
    const cleanPhone = normalizePhone(phone);
    return phoneRegx.test(cleanPhone);
};
export function isEmail(email: string): boolean {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  return /^(080|090|091|070|081)\d{8}$/.test(phoneNumber);
}

export function isValidAmount(amount: string) {
  const newAmount = parseInt(amount, 10);
  if (isNaN(newAmount)) return false;

  return newAmount >= 100 && newAmount <= 10000;
}

export function isValidMeterNumber(value: string) {
  return value.length > 4;
}

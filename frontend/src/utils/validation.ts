export const required = (value: any): string | undefined => {
  if (!value && value !== 0) return 'This field is required';
  if (typeof value === 'string' && !value.trim()) return 'This field is required';
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (!value) return undefined;
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!pattern.test(value)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return undefined;
};

export const password = (value: string): string | undefined => {
  if (!value) return undefined;
  
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
  
  if (value.length < 8) {
    return 'Password must be at least 8 characters';
  }
  
  if (!hasUppercase || !hasLowercase) {
    return 'Password must include both uppercase and lowercase letters';
  }
  
  if (!hasNumber && !hasSpecialChar) {
    return 'Password must include at least one number or special character';
  }
  
  return undefined;
};

export const matchValue = (field: string, fieldName: string) => (
  value: string,
  values: Record<string, any>
): string | undefined => {
  if (!value) return undefined;
  if (value !== values[field]) {
    return `Must match ${fieldName}`;
  }
  return undefined;
};

export const number = (value: string): string | undefined => {
  if (!value) return undefined;
  if (isNaN(Number(value))) {
    return 'Must be a number';
  }
  return undefined;
};

export const integer = (value: string): string | undefined => {
  if (!value) return undefined;
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
  return undefined;
};

export const positiveNumber = (value: string): string | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return 'Must be a positive number';
  }
  return undefined;
};

export const nonNegativeNumber = (value: string): string | undefined => {
  if (!value) return undefined;
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    return 'Must be zero or a positive number';
  }
  return undefined;
};

export const composeValidators = (...validators: Array<(value: any, values?: any) => string | undefined>) => (
  value: any,
  values?: any
): string | undefined => {
  for (const validator of validators) {
    const error = validator(value, values);
    if (error) {
      return error;
    }
  }
  return undefined;
};
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 chars, 1 letter, 1 number, 1 symbol
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2);
};

export const mockLogin = async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
  // Mock authentication - in real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!validateEmail(email)) {
    return { success: false, error: 'Invalid email format' };
  }
  
  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be at least 8 characters, and include at least 1 letter, 1 number, and 1 symbol' };
  }
  
  return {
    success: true,
    user: {
      email,
      name: email.split('@')[0],
    },
  };
};
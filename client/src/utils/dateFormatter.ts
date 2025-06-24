export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateForInput = (date: string | Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const addDays = (date: string | Date, days: number): string => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};

export const isOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date();
};
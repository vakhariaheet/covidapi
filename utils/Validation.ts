export const isDate = (date: string): boolean => {
	console.log(date);
	return /\d{4}-\d{2}-\d{2}/.test(date);
};

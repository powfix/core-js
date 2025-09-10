export function parseBoolean(value: any, defaultValue: boolean): boolean {
	if (value === undefined || value === null) return defaultValue;
	return (value === 'true' || value === true) || (value === 1 || value === '1');
}
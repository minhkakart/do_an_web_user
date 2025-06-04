export function getItemStorage<T>(key: string) : T | null {
	const value = localStorage.getItem(key)!;
	if (value !== 'undefined') {
		return JSON.parse(value);
	} else {
		return null;
	}
}

export function setItemStorage<T>(key: string, value: T) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function deleteItemStorage(...keys: Array<any>) {
	keys.forEach((key) => {
		localStorage.removeItem(key);
	});
}

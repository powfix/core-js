export class RandomUtils {
	static randomNumber(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static randomLatinStrings(length: number) {
		const strings = [];
		for (let i = 0; i < length; ++i) {
			const isLowerCase = RandomUtils.randomNumber(0, 1);
			if (isLowerCase) {
				strings.push(String.fromCharCode(RandomUtils.randomNumber(97, 122)));
			} else {
				strings.push(String.fromCharCode(RandomUtils.randomNumber(65, 90)));
			}
		}
		return strings.join('');
	}

	static randomLatinLowercaseStrings(length: number) {
		const strings = [];
		for (let i = 0; i < length; ++i) {
			strings.push(String.fromCharCode(RandomUtils.randomNumber(97, 122)));
		}
		return strings.join('');
	}

	static randomLatinUppercaseStrings(length: number) {
		const strings = [];
		for (let i = 0; i < length; ++i) {
			strings.push(String.fromCharCode(RandomUtils.randomNumber(65, 90)));
		}
		return strings.join('');
	}

	static randomNumberStrings(length: number) {
		const strings = [];
		for (let i = 0; i < length; ++i) {
			strings.push(String.fromCharCode(RandomUtils.randomNumber(48, 57)));
		}
		return strings.join('');
	}

	static randomStrings(length: number) {
		const strings = [];
		for (let i = 0; i < length; ++i) {
			const isNumber = RandomUtils.randomNumber(0, 1);
			if (isNumber) {
				strings.push(String.fromCharCode(RandomUtils.randomNumber(48, 57)));
			} else {
				const isLowerCase = RandomUtils.randomNumber(0, 1);
				if (isLowerCase) {
					strings.push(String.fromCharCode(RandomUtils.randomNumber(97, 122)));
				} else {
					strings.push(String.fromCharCode(RandomUtils.randomNumber(65, 90)));
				}
			}
		}
		return strings.join('');
	}
}

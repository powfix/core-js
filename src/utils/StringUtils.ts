export class StringUtils {
	public static numberWithCommas(x: string | any): string {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	public static getByte(s: string): number {
		const getByteLength = (decimal: number) => {
			const LINE_FEED = 10;
			return (decimal >> 7) || (LINE_FEED === decimal) ? 2 : 1
		};

		return s
			.split('')
			.map((s) => s.charCodeAt(0))
			.reduce((prev, unicodeDecimalValue) => prev + getByteLength(unicodeDecimalValue), 0)
	}

	public static levenshteinDistance = (str1: string = '', str2: string = ''): number => {
		const track = Array(str2.length + 1).fill(null).map(() =>
			Array(str1.length + 1).fill(null));

		for (let i = 0; i <= str1.length; i += 1) {
			track[0][i] = i;
		}

		for (let j = 0; j <= str2.length; j += 1) {
			track[j][0] = j;
		}

		for (let j = 1; j <= str2.length; j += 1) {
			for (let i = 1; i <= str1.length; i += 1) {
				const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
				track[j][i] = Math.min(
					track[j][i - 1] + 1, // deletion
					track[j - 1][i] + 1, // insertion
					track[j - 1][i - 1] + indicator, // substitution
				);
			}
		}

		return track[str2.length][str1.length];
	};
}

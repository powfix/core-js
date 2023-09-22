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
}

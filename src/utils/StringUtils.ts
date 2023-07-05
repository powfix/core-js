export class StringUtils {
	static numberWithCommas(x: string | any): string {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}

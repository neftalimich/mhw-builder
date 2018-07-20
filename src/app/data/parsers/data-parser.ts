export abstract class DataParser<T> {
	abstract parse(data: string): T[];
}

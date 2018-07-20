import { DataParser } from './data-parser';

export class TagsParser extends DataParser<string> {
	parse(data: string): string[] {
		return data.split(';');
	}
}

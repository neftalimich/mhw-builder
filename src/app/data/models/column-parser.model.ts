import { DataParser } from '../parsers/data-parser';

export class ColumnParser {
	columnName: string;
	parser: DataParser<any>;
}

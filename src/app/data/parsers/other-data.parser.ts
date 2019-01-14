import { OtherDataModel } from '../../models/other-data.model';
import { DataParser } from './data-parser';

export class OtherDataParser extends DataParser<OtherDataModel> {
	parse(data: string): OtherDataModel[] {
		const values = data.split(';');
		const otherLevels: OtherDataModel[] = [];
		for (const value of values) {
			const parts = value.split('-');
			otherLevels.push({
				value: parts[0],
				data: parts.length == 2 ? parseInt(parts[1], 10) : null
			});
		}
		return otherLevels;
	}
}

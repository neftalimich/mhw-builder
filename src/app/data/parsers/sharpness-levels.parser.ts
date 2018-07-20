import { DataParser } from './data-parser';
import { SharpnessLevelModel } from '../../models/sharpness-level.model';
import { SharpnessType } from '../../types/sharpness.type';
import * as _ from 'lodash';

export class SharpnessLevelsParser extends DataParser<SharpnessLevelModel> {
	parse(data: string): SharpnessLevelModel[] {
		const values = data.split(';');
		const sharpnessLevels: SharpnessLevelModel[] = [];
		const items = _.filter(values, v => v != null && v != '');
		for (const item of items) {
			const parts = item.split('-');
			sharpnessLevels.push({
				color: parts[0] as SharpnessType,
				value: parseInt(parts[1], 10)
			});
		}
		return sharpnessLevels;
	}
}

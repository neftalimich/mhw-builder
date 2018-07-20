import { SlotModel } from '../../models/slot.model';
import { DataParser } from './data-parser';
import * as _ from 'lodash';

export class SlotsParser extends DataParser<SlotModel> {
	parse(data: string): SlotModel[] {
		const values = data.split(';');
		const slots: SlotModel[] = [];
		for (const item of _.filter(values, v => v)) {
			slots.push({
				level: Number(item),
			});
		}
		return slots;
	}
}

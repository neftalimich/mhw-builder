import { SlotModel } from './slot.model';

export class ToolModel {
	id: number;
	type: string;
	name: string;
	description: string;
	recharge: number;
	duration: number;
	slots?: SlotModel[];
}

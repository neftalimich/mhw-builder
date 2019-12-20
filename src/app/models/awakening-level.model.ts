import { AwakeningType } from '../types/awakening.type';

export class AwakeningLevelModel {
	id: number;
	type: AwakeningType;
	level: number;

	constructor() {
		this.id = 0;
		this.type = AwakeningType.None;
		this.level = 0;
	}
}

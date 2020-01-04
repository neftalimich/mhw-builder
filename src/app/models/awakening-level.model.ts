import { AwakeningType } from '../types/awakening.type';

export class AwakeningLevelModel {
	id: number;
	type: AwakeningType;
	name: string;
	short?: string;
	level: number;
	minLevel: number;
	maxLevel: number;

	constructor() {
		this.id = 0;
		this.type = AwakeningType.None;
		this.name = 'None';
		this.short = 'None';
		this.level = 0;
		this.minLevel = 1;
		this.maxLevel = 6;
	}
}

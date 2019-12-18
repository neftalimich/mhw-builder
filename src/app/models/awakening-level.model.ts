import { SkillReferenceModel } from './skill-reference.model';

export class AwakeningLevelModel {
	id: number;
	type: string;
	level: number;

	constructor() {
		this.id = 0;
		this.type = 'None';
		this.level = 0;
	}
}

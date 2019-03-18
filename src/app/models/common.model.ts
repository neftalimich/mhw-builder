import { SkillReferenceModel } from './skill-reference.model';

export class CommonModel {
	id: number;
	code: string;
	name: string;
	description: string;
	levels: CommonLevelModel[];
}

export class CommonLevelModel {
	description: string;
	skills: SkillReferenceModel[];
}

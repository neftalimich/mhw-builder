import { SkillLevelModel } from './skill-level.model';

export class SkillModel {
	id: string;
	name: string;
	description: string;
	maxLevel?: number;
	raiseSkillId?: string;
	levels: SkillLevelModel[];
	hasActiveStats?: boolean;
}

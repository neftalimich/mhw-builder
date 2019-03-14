import { SkillReferenceModel } from './skill-reference.model';

export class ModificationLevelModel {
	description: string;
	recoil: number;
	reload: number;
	passiveDeviation: number;
	close: number;
	long: number;
	shiled: number;
	slotLevel: number;
	skills: SkillReferenceModel[];
}

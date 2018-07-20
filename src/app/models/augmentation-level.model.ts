import { SkillReferenceModel } from './skill-reference.model';

export class AugmentationLevelModel {
	description: string;
	passiveAttack: number;
	passiveAffinity: number;
	passiveDefense: number;
	healOnHitPercent: number;
	slotLevel: number;
	skills: SkillReferenceModel[];
}

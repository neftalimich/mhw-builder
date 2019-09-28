import { AugmentationType } from '../types/augmentation.type';
import { SkillReferenceModel } from './skill-reference.model';

export class UpgradeModel {
	id: number;
	type: AugmentationType;
	name: string;
	description: string;
	levels: UpgradeLevelModel[];
}

export class UpgradeLevelModel {
	description: string;
	type: AugmentationType;

	requiredSlots: number;
	totalSlots: number;

	passiveAttack: number;
	passiveAffinity: number;
	passiveDefense: number;
	slotLevel: number;
	passiveElement: number;
	passiveAilment: number;
	healOnHitPercent: number;

	skills: SkillReferenceModel[];
}

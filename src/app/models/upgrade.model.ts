import { AugmentationType } from '../types/augmentation.type';
import { SkillReferenceModel } from './skill-reference.model';

export class UpgradeModel {
	id: number;
	type: AugmentationType;
	name: string;
	description: string;
	levels: UpgradeLevelModel[];
	multiplier: number;
	customLevel: number[];
	customLevelMax: number[];
}

export class UpgradeLevelModel {
	type: AugmentationType;
	level: number;
	requiredSlots: number;
	totalSlots: number;

	passiveAttack: number;
	passiveAffinity: number;
	passiveDefense: number;
	healOnHitPercent: number;
	slotLevel: number;
	passiveElement: number;
	passiveAilment: number;

	description: string;

	skills: SkillReferenceModel[];

	constructor() {
		this.passiveAttack = 0;
		this.passiveAffinity = 0;
		this.passiveDefense = 0;
		this.slotLevel = 0;
		this.healOnHitPercent = 0;
		this.passiveElement = 0;
		this.passiveAilment = 0;

		this.description = '';
	}
}

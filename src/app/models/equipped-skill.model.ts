import { SkillModel } from './skill.model';

export class EquippedSkillModel {
	skill: SkillModel;
	id: string;
	name: string;
	description: string;
	equippedCount: number;
	totalLevelCount: number;

	weaponCount: number; // Weapon
	headCount: number; // Helm
	chestCount: number; // Chest
	handsCount: number; // Arms
	legsCount: number; // Waist
	feetCount: number; // Legs
	charmCount: number; // Charm
	toolCount: number; // Tool

	isSetBonus: boolean;

	constructor() {
		this.weaponCount = 0;
		this.headCount = 0;
		this.chestCount = 0;
		this.handsCount = 0;
		this.legsCount = 0;
		this.feetCount = 0;
		this.charmCount = 0;
		this.toolCount = 0;
		this.isSetBonus = false;
	}
}

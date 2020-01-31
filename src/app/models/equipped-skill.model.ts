import { SkillModel } from './skill.model';

export class EquippedSkillModel {
	skill: SkillModel;
	id: string;
	name: string;
	description: string;
	equippedArmorCount: number;
	equippedTool1Count: number;
	equippedTool2Count: number;
	equippedToolActiveCount: number;
	equippedCount: number;
	secretLevelCount: number;
	totalLevelCount: number;

	weaponCount: number; // Weapon
	headCount: number; // Helm
	chestCount: number; // Chest
	armsCount: number; // Arms
	waistCount: number; // Waist
	legsCount: number; // Legs
	charmCount: number; // Charm
	toolCount: number; // Tool

	isSetBonus: boolean;
	isNatureBonus: boolean;
	requiredCount?: number;

	hasActiveStats?: boolean;

	constructor() {
		this.weaponCount = 0;
		this.headCount = 0;
		this.chestCount = 0;
		this.armsCount = 0;
		this.waistCount = 0;
		this.legsCount = 0;
		this.charmCount = 0;
		this.toolCount = 0;

		this.equippedArmorCount = 0;
		this.equippedTool1Count = 0;
		this.equippedTool2Count = 0;
		this.equippedToolActiveCount = 0;
		this.equippedCount = 0;

		this.secretLevelCount = 0;

		this.isSetBonus = false;
		this.isNatureBonus = false;
	}
}

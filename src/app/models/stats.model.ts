import { AilmentType } from '../types/ailment.type';
import { ElementType } from '../types/element.type';
import { WeaponType } from '../types/weapon.type';
import { AmmoCapacitiesModel } from './ammo-capacities.model';
import { ExtraDataModel } from './extra-data.model';

export class StatsModel {
	totalAttack: number;
	totalAttackPotential: number;
	attack: number;
	passiveAttack: number;
	activeAttack: number;
	sharpnessDataNeeded: boolean;
	passiveSharpness: number;
	sharpnessLevelsBar: number[];
	effectivePhysicalSharpnessModifier: number;
	effectiveElementalSharpnessModifier: number;
	weaponType?: WeaponType;
	weaponAttackModifier: number;
	critElementModifier: number;
	affinity: number;
	passiveAffinity: number;
	activeAffinity: number;
	weakPointAffinity: number;
	drawAffinity: number;
	slidingAffinity: number;
	passiveCriticalBoostPercent: number;
	criticalElement: boolean;
	criticalStatus: boolean;

	elementless: boolean;
	elementlessBoostPercent: number;

	element: ElementType;
	baseElementAttack: number;
	effectivePassiveElementAttack: number;
	elementHidden: boolean;
	effectiveElementAttack: number;
	elementCap: number;
	elementCapped: boolean;
	totalElementAttack: number;

	ailment: AilmentType;
	baseAilmentAttack: number;
	effectivePassiveAilmentAttack: number;
	ailmentHidden: boolean;
	effectiveAilmentAttack: number;
	ailmentCap: number;
	ailmentCapped: boolean;
	totalAilmentAttack: number;

	elementAttackMultiplier: number;

	passiveDragonAttack: number;
	passiveDragonAttackPercent: number;
	passiveFireAttack: number;
	passiveFireAttackPercent: number;
	passiveIceAttack: number;
	passiveIceAttackPercent: number;
	passiveWaterAttack: number;
	passiveWaterAttackPercent: number;
	passiveThunderAttack: number;
	passiveThunderAttackPercent: number;
	passivePoisonAttack: number;
	passivePoisonBuildupPercent: number;
	passiveSleepAttack: number;
	passiveSleepBuildupPercent: number;
	passiveParalysisAttack: number;
	passiveParalysisBuildupPercent: number;
	passiveBlastAttack: number;
	passiveBlastBuildupPercent: number;
	passiveStunAttack: number;
	passiveStunBuildupPercent: number;

	effectivePassiveAilmentBuildupPercent: number;

	elderseal: string;
	eldersealLevelBoost: number;

	defense: number;
	maxDefense: number;
	augmentedDefense: number;
	passiveDefense: number;
	passiveHealth: number;
	passiveStamina: number;

	fireResist: number;
	waterResist: number;
	thunderResist: number;
	iceResist: number;
	dragonResist: number;

	passiveFireResist: number;
	passiveWaterResist: number;
	passiveThunderResist: number;
	passiveIceResist: number;
	passiveDragonResist: number;

	healOnHitPercent: number;

	ammoCapacities: AmmoCapacitiesModel;
	ammoCapacitiesUp: AmmoCapacitiesModel;
	ammoUp: number;
	extraData: ExtraDataModel;
	recoil: number;
	reload: number;
	deviation: number;

	constructor() {
		this.totalAttack = 0;
		this.attack = 0;
		this.passiveAttack = 0;
		this.activeAttack = 0;

		this.elementless = false;
		this.elementlessBoostPercent = 0;

		this.sharpnessDataNeeded = false;
		this.passiveSharpness = 0;
		this.effectivePhysicalSharpnessModifier = 1;
		this.effectiveElementalSharpnessModifier = 1;
		this.weaponAttackModifier = 0;
		this.critElementModifier = 0;
		this.affinity = 0;
		this.passiveAffinity = 0;
		this.activeAffinity = 0;
		this.weakPointAffinity = 0;
		this.drawAffinity = 0;
		this.slidingAffinity = 0;
		this.passiveCriticalBoostPercent = 0;
		this.criticalElement = false;
		this.criticalStatus = false;

		this.element = null;
		this.baseElementAttack = 0;
		this.elementHidden = false;
		this.effectiveElementAttack = 0;
		this.elementCap = 0;
		this.elementCapped = false;
		this.totalElementAttack = 0;

		this.ailment = null;
		this.baseAilmentAttack = 0;
		this.ailmentHidden = false;
		this.effectiveAilmentAttack = 0;
		this.ailmentCap = 0;
		this.ailmentCapped = false;
		this.totalAilmentAttack = 0;

		this.elementAttackMultiplier = 0;

		this.passiveFireAttack = 0;
		this.passiveFireAttackPercent = 0;
		this.passiveWaterAttack = 0;
		this.passiveWaterAttackPercent = 0;
		this.passiveThunderAttack = 0;
		this.passiveThunderAttackPercent = 0;
		this.passiveIceAttack = 0;
		this.passiveIceAttackPercent = 0;
		this.passiveDragonAttack = 0;
		this.passiveDragonAttackPercent = 0;
		this.passivePoisonAttack = 0;
		this.passivePoisonBuildupPercent = 0;
		this.passiveSleepAttack = 0;
		this.passiveSleepBuildupPercent = 0;
		this.passiveParalysisAttack = 0;
		this.passiveParalysisBuildupPercent = 0;
		this.passiveBlastAttack = 0;
		this.passiveBlastBuildupPercent = 0;
		this.passiveStunAttack = 0;
		this.passiveStunBuildupPercent = 0;
		this.effectivePassiveElementAttack = 0;
		this.effectivePassiveAilmentAttack = 0;
		this.effectivePassiveAilmentBuildupPercent = 0;

		this.elderseal = null;
		this.eldersealLevelBoost = 0;

		this.defense = 0;
		this.maxDefense = 0;
		this.augmentedDefense = 0;
		this.passiveDefense = 0;
		this.passiveHealth = 0;
		this.passiveStamina = 0;

		this.recoil = 0;
		this.reload = 0;
		this.deviation = 0;

		this.fireResist = 0;
		this.waterResist = 0;
		this.thunderResist = 0;
		this.iceResist = 0;
		this.dragonResist = 0;

		this.passiveFireResist = 0;
		this.passiveWaterResist = 0;
		this.passiveThunderResist = 0;
		this.passiveIceResist = 0;
		this.passiveDragonResist = 0;

		this.healOnHitPercent = 0;

		this.ammoCapacities = null;
		this.ammoCapacitiesUp = null;
		this.ammoUp = 0;
		this.extraData = null;
	}
}

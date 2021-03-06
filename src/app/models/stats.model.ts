import { AilmentType } from '../types/ailment.type';
import { ElementType } from '../types/element.type';
import { WeaponType } from '../types/weapon.type';
import { AmmoCapacitiesModel } from './ammo-capacities.model';
import { ExtraDataModel } from './extra-data.model';
import { KinsectModel } from './kinsect.model';

export class StatsModel {
	weaponType?: WeaponType;
	totalAttack: number;
	totalAttackPotential: number;
	attack: number;
	upgradeAttack: number;
	awakeningAttack: number;
	passiveAttack: number;
	activeAttack: number;
	activeAttackPercent: number;

	sharpnessDataNeeded: boolean;
	passiveSharpness: number;
	extraSharpness: number;
	sharpnessLevelsBar: number[];
	effectivePhysicalSharpnessModifier: number;
	effectiveElementalSharpnessModifier: number;
	extraSlot: number;

	weaponAttackModifier: number;
	critElementModifier: number;
	trueCritElementModifier: number;
	critStatusModifier: number;
	trueCritStatusModifier: number;
	affinity: number;
	upgradeAffinity: number;
	awakeningAffinity: number;
	passiveAffinity: number;
	activeAffinity: number;
	weakPointAffinity: number;
	passiveCriticalBoostPercent: number;
	criticalElement: boolean;
	criticalStatus: boolean;
	trueCriticalElement: boolean;
	trueCriticalStatus: boolean;

	elementless: boolean;
	elementlessBoostPercent: number;

	element: ElementType;
	baseElementAttack: number;
	upgradeElementAttack: number;
	awakeningElementAttack: number;
	effectivePassiveElementAttack: number;
	elementHidden: boolean;
	effectiveElementAttack: number;
	elementCap: number;
	elementCapped: boolean;
	totalElementAttack: number;
	totalElementAttackPotential: number;

	ailment: AilmentType;
	baseAilmentAttack: number;
	upgradeAilmentAttack: number;
	awakeningAilmentAttack: number;
	effectivePassiveAilmentAttack: number;
	ailmentHidden: boolean;
	effectiveAilmentAttack: number;
	ailmentCap: number;
	ailmentCapped: boolean;
	totalAilmentAttack: number;
	totalAilmentAttackPotential: number;

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

	activeElementAttack: number;
	activeAilmentAttack: number;
	activeAilmentAttackBuildUpPercent: number;

	elderseal: string;
	eldersealLevelBoost: number;

	defense: number[];
	passiveDefense: number;
	passiveDefensePercent: number;
	activeDefense: number;
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

	passiveElementResistPercent?: number;

	healOnHitPercent: number;
	hastenRecovery?: number;

	ammoCapacities: AmmoCapacitiesModel;
	ammoCapacitiesUp: AmmoCapacitiesModel;
	ammoUp: number;
	extraData: ExtraDataModel;
	recoil: number;
	reload: number;
	deviation: number;

	kinsect?: KinsectModel;

	frostcraft?: number[];

	constructor() {
		this.totalAttack = 0;
		this.attack = 0;
		this.upgradeAttack = 0;
		this.awakeningAttack = 0;
		this.passiveAttack = 0;
		this.activeAttack = 0;
		this.activeAttackPercent = 0;

		this.elementless = false;
		this.elementlessBoostPercent = 0;

		this.sharpnessDataNeeded = false;
		this.passiveSharpness = 0;
		this.extraSharpness = 0;
		this.effectivePhysicalSharpnessModifier = 1;
		this.effectiveElementalSharpnessModifier = 1;
		this.extraSlot = 0;
		this.weaponAttackModifier = 0;
		this.critElementModifier = 0;
		this.trueCritElementModifier = 0;
		this.critStatusModifier = 0;
		this.trueCritStatusModifier = 0;
		this.affinity = 0;
		this.upgradeAffinity = 0;
		this.awakeningAffinity = 0;
		this.passiveAffinity = 0;
		this.activeAffinity = 0;
		this.weakPointAffinity = 0;
		this.passiveCriticalBoostPercent = 0;
		this.criticalElement = false;
		this.criticalStatus = false;
		this.trueCriticalElement = false;
		this.trueCriticalStatus = false;

		this.element = null;
		this.baseElementAttack = 0;
		this.upgradeElementAttack = 0;
		this.awakeningElementAttack = 0;
		this.elementHidden = false;
		this.effectiveElementAttack = 0;
		this.elementCap = 0;
		this.elementCapped = false;
		this.totalElementAttack = 0;
		this.totalElementAttackPotential = 0;

		this.ailment = null;
		this.baseAilmentAttack = 0;
		this.upgradeAilmentAttack = 0;
		this.awakeningAilmentAttack = 0;
		this.ailmentHidden = false;
		this.effectiveAilmentAttack = 0;
		this.ailmentCap = 0;
		this.ailmentCapped = false;
		this.totalAilmentAttack = 0;
		this.totalAilmentAttackPotential = 0;

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

		this.activeElementAttack = 0;
		this.activeAilmentAttack = 0;
		this.activeAilmentAttackBuildUpPercent = 0;

		this.elderseal = null;
		this.eldersealLevelBoost = 0;

		this.defense = [0, 0, 0];
		this.passiveDefense = 0;
		this.passiveDefensePercent = 0;
		this.activeDefense = 0;
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

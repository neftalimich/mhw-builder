export class SkillLevelModel {
	description: string;

	passiveAttack: number;
	activeAttack: number;
	elementlessBoostPercent: number;
	passiveCriticalBoostPercent: number;
	criticalElement: boolean;
	criticalStatus: boolean;

	passiveAffinity: number;
	activeAffinity: number;
	weakPointAffinity: number;
	drawAffinity: number;
	slidingAffinity: number;

	passiveSharpness: number;

	hiddenElementUp: number;
	ammoUp: number;
	eldersealLevelBoost: number;

	activeElementAttack?: number;
	activeElementAttackPercent?: number;
	passiveFireAttack: number;
	passiveFireAttackPercent: number;
	passiveWaterAttack: number;
	passiveWaterAttackPercent: number;
	passiveThunderAttack: number;
	passiveThunderAttackPercent: number;
	passiveIceAttack: number;
	passiveIceAttackPercent: number;
	passiveDragonAttack: number;
	passiveDragonAttackPercent: number;

	activeBlightAttack?: number;
	activeAilmentAttackBuildUpPercent?: number;
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

	passiveGaugeFillRatePercent: number;

	passiveWeaponChargeReductionPercent: number;

	passiveDefense: number;
	passiveDefensePercent: number;
	passiveHealth: number;
	passiveStamina: number;

	passiveFireResist: number;
	passiveWaterResist: number;
	passiveThunderResist: number;
	passiveIceResist: number;
	passiveDragonResist: number;
}

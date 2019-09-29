import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { AugmentationModel } from '../models/augmentation.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { SkillLevelModel } from '../models/skill-level.model';
import { StatsModel } from '../models/stats.model';
import { UpgradeContainerModel, UpgradeDetailModel } from '../models/upgrade-container.model';
import { AilmentType } from '../types/ailment.type';
import { DamageType } from '../types/damage.type';
import { EldersealType } from '../types/elderseal.type';
import { ElementType } from '../types/element.type';
import { ItemType } from '../types/item.type';
import { WeaponType } from '../types/weapon.type';
import { CalculationService } from './calculation.service';
import { DataService } from './data.service';

@Injectable()
export class StatService {
	public statsUpdated$ = new Subject<StatsModel>();

	readonly defaultElementAttackIncreaseCap = 0.3;

	stats = new StatsModel();

	constructor(
		private dataService: DataService,
		private calcService: CalculationService
	) { }

	update(skills: EquippedSkillModel[], items: ItemModel[], augmentations: AugmentationModel[], upgradeContainer: UpgradeContainerModel, modifications: ModificationModel[], kinsect: KinsectModel) {
		this.stats = new StatsModel();
		this.updateItemStats(items);
		this.updateSkillStats(skills);
		this.updateAugmentations(augmentations);
		if (upgradeContainer) {
			this.updateUpgrades(upgradeContainer);
		}
		this.updateModifications(modifications);

		const weapon = _.find(items, item => item.weaponType != null);

		if (weapon) {
			switch (weapon.weaponType) {
				case WeaponType.HeavyBowgun:
				case WeaponType.LightBowgun:
					this.stats.ammoCapacities = weapon.ammoCapacities;
					break;
				case WeaponType.InsectGlaive:
					this.stats.kinsect = kinsect;
					break;
				default:
					break;
			}
			this.stats.weaponType = weapon.weaponType;
		}

		this.calculateAttack(weapon);

		this.statsUpdated$.next(this.stats);

		this.calcService.updateCalcs(this.stats);
	}

	private updateItemStats(items: ItemModel[]) {
		for (const item of items) {
			if (item.itemType != ItemType.Tool1 && item.itemType != ItemType.Tool2) {
				if (item.baseAttack) { this.stats.attack += item.baseAttack; }
				if (item.baseAffinityPercent) { this.stats.affinity += item.baseAffinityPercent; }
				if (item.itemType == ItemType.Weapon) {
					if (item.defense) {
						for (let i = 0; i < this.stats.defense.length; i++) {
							this.stats.defense[i] += item.defense[0];
						}
					}
				} else {
					if (item.defense) {
						for (let i = 0; i < this.stats.defense.length; i++) {
							this.stats.defense[i] += item.defense[i];
						}
					}
				}
				if (item.fireResist) { this.stats.fireResist += item.fireResist; }
				if (item.waterResist) { this.stats.waterResist += item.waterResist; }
				if (item.thunderResist) { this.stats.thunderResist += item.thunderResist; }
				if (item.iceResist) { this.stats.iceResist += item.iceResist; }
				if (item.dragonResist) { this.stats.dragonResist += item.dragonResist; }
				if (item.element) { this.stats.element = item.element; }
				if (item.elementBaseAttack) { this.stats.baseElementAttack += item.elementBaseAttack; }
				if (item.ailment) { this.stats.ailment = item.ailment; }
				if (item.ailmentBaseAttack) { this.stats.baseAilmentAttack += item.ailmentBaseAttack; }
				if (item.elderseal) { this.stats.elderseal = item.elderseal; }
			}
		}
	}

	private updateSkillStats(equippedSkills: EquippedSkillModel[]) {
		for (const equippedSkill of equippedSkills) {
			let level: SkillLevelModel;

			if (equippedSkill.equippedCount) {
				const levelIndex = Math.min(equippedSkill.equippedCount, equippedSkill.skill.levels.length) - 1;
				level = equippedSkill.skill.levels[levelIndex];
			}

			if (level) {

				if (level.activeElementAttack) { this.stats.activeElementAttack += level.activeElementAttack; }
				if (level.activeAilmentAttackBuildUpPercent) { this.stats.activeAilmentAttackBuildUpPercent += level.activeAilmentAttackBuildUpPercent; }

				if (level.passiveAttack) { this.stats.passiveAttack += level.passiveAttack; }
				if (level.activeAttack) { this.stats.activeAttack += level.activeAttack; }
				if (level.elementlessBoostPercent) { this.stats.elementlessBoostPercent += level.elementlessBoostPercent; }
				if (level.passiveAffinity) { this.stats.passiveAffinity += level.passiveAffinity; }
				if (level.activeAffinity) { this.stats.activeAffinity += level.activeAffinity; }
				if (level.weakPointAffinity) { this.stats.weakPointAffinity += level.weakPointAffinity; }
				if (level.drawAffinity) { this.stats.drawAffinity += level.drawAffinity; }
				if (level.slidingAffinity) { this.stats.slidingAffinity += level.slidingAffinity; }
				if (level.passiveSharpness) { this.stats.passiveSharpness += level.passiveSharpness; }

				if (level.passiveCriticalBoostPercent) { this.stats.passiveCriticalBoostPercent += level.passiveCriticalBoostPercent; }
				if (level.criticalElement) { this.stats.criticalElement = true; }
				if (level.criticalStatus) { this.stats.criticalStatus = true; }

				if (level.passiveFireAttack) { this.stats.passiveFireAttack += level.passiveFireAttack; }
				if (level.passiveWaterAttack) { this.stats.passiveWaterAttack += level.passiveWaterAttack; }
				if (level.passiveThunderAttack) { this.stats.passiveThunderAttack += level.passiveThunderAttack; }
				if (level.passiveIceAttack) { this.stats.passiveIceAttack += level.passiveIceAttack; }
				if (level.passiveDragonAttack) { this.stats.passiveDragonAttack += level.passiveDragonAttack; }

				if (level.passiveFireAttackPercent) { this.stats.passiveFireAttackPercent += level.passiveFireAttackPercent; }
				if (level.passiveWaterAttackPercent) { this.stats.passiveWaterAttackPercent += level.passiveWaterAttackPercent; }
				if (level.passiveThunderAttackPercent) { this.stats.passiveThunderAttackPercent += level.passiveThunderAttackPercent; }
				if (level.passiveIceAttackPercent) { this.stats.passiveIceAttackPercent += level.passiveIceAttackPercent; }
				if (level.passiveDragonAttackPercent) { this.stats.passiveDragonAttackPercent += level.passiveDragonAttackPercent; }

				if (level.passivePoisonAttack) { this.stats.passivePoisonAttack += level.passivePoisonAttack; }
				if (level.passiveSleepAttack) { this.stats.passiveSleepAttack += level.passiveSleepAttack; }
				if (level.passiveParalysisAttack) { this.stats.passiveParalysisAttack += level.passiveParalysisAttack; }
				if (level.passiveBlastAttack) { this.stats.passiveBlastAttack += level.passiveBlastAttack; }
				if (level.passiveStunAttack) { this.stats.passiveStunAttack += level.passiveStunAttack; }

				if (level.passivePoisonBuildupPercent) { this.stats.passivePoisonBuildupPercent += level.passivePoisonBuildupPercent; }
				if (level.passiveSleepBuildupPercent) { this.stats.passiveSleepBuildupPercent += level.passiveSleepBuildupPercent; }
				if (level.passiveParalysisBuildupPercent) { this.stats.passiveParalysisBuildupPercent += level.passiveParalysisBuildupPercent; }
				if (level.passiveBlastBuildupPercent) { this.stats.passiveBlastBuildupPercent += level.passiveBlastBuildupPercent; }
				if (level.passiveStunBuildupPercent) { this.stats.passiveStunBuildupPercent += level.passiveStunBuildupPercent; }

				if (level.passiveDefense) { this.stats.passiveDefense += level.passiveDefense; }
				if (level.passiveDefensePercent) { this.stats.passiveDefensePercent += level.passiveDefensePercent; }
				if (level.passiveHealth) { this.stats.passiveHealth += level.passiveHealth; }
				if (level.passiveStamina) { this.stats.passiveStamina += level.passiveStamina; }

				if (level.passiveFireResist) { this.stats.passiveFireResist += level.passiveFireResist; }
				if (level.passiveWaterResist) { this.stats.passiveWaterResist += level.passiveWaterResist; }
				if (level.passiveThunderResist) { this.stats.passiveThunderResist += level.passiveThunderResist; }
				if (level.passiveIceResist) { this.stats.passiveIceResist += level.passiveIceResist; }
				if (level.passiveDragonResist) { this.stats.passiveDragonResist += level.passiveDragonResist; }

				if (level.hiddenElementUp) { this.stats.elementAttackMultiplier = level.hiddenElementUp; }
				if (level.ammoUp) { this.stats.ammoUp += level.ammoUp; }
				if (level.eldersealLevelBoost) { this.stats.eldersealLevelBoost = level.eldersealLevelBoost; }
			}
		}
	}

	private updateAugmentations(augmentations: AugmentationModel[]) {
		const augGroups = _.groupBy(augmentations, 'id');

		for (const key in augGroups) {
			if (augGroups.hasOwnProperty(key)) {
				const value = augGroups[key];

				const level = value[0].levels[value.length - 1];
				if (level) {
					if (level.passiveAttack) { this.stats.passiveAttack += level.passiveAttack; }
					if (level.passiveAffinity) { this.stats.passiveAffinity += level.passiveAffinity; }
					if (level.passiveDefense) { this.stats.passiveDefense += level.passiveDefense; }
					if (level.healOnHitPercent) { this.stats.healOnHitPercent += level.healOnHitPercent; }
				}
			}
		}
	}

	private updateUpgrades(upgradeContainer: UpgradeContainerModel) {
		for (const detail of upgradeContainer.upgradeDetails) {
			if (detail.passiveAttack) { this.stats.passiveAttack += detail.passiveAttack; }
			if (detail.passiveAffinity) { this.stats.passiveAffinity += detail.passiveAffinity; }
			if (detail.passiveDefense) { this.stats.passiveDefense += detail.passiveDefense; }
			if (detail.healOnHitPercent) { this.stats.healOnHitPercent += detail.healOnHitPercent; }
			if (detail.passiveElement) {
				this.stats.passiveFireAttack += detail.passiveElement;
				this.stats.passiveWaterAttack += detail.passiveElement;
				this.stats.passiveThunderAttack += detail.passiveElement;
				this.stats.passiveIceAttack += detail.passiveElement;
				this.stats.passiveDragonAttack += detail.passiveElement;
			}
			if (detail.passiveAilment) {
				this.stats.passivePoisonAttack += detail.passiveAilment;
				this.stats.passiveSleepAttack += detail.passiveAilment;
				this.stats.passiveParalysisAttack += detail.passiveAilment;
				this.stats.passiveBlastAttack += detail.passiveAilment;
			}
		}

		const upgradePassiveAttack = upgradeContainer.customUpgrades.filter(custom => custom == 'Attack').length;
		const upgradePassiveAffinity = upgradeContainer.customUpgrades.filter(custom => custom == 'Affinity').length;
		const upgradePassiveAilmentElement = upgradeContainer.customUpgrades.filter(custom => custom == 'Element').length * 10;

		this.stats.passiveAttack += upgradePassiveAttack;
		this.stats.passiveAffinity += upgradePassiveAffinity;

		this.stats.passiveFireAttack += upgradePassiveAilmentElement;
		this.stats.passiveWaterAttack += upgradePassiveAilmentElement;
		this.stats.passiveThunderAttack += upgradePassiveAilmentElement;
		this.stats.passiveIceAttack += upgradePassiveAilmentElement;
		this.stats.passiveDragonAttack += upgradePassiveAilmentElement;

		this.stats.passivePoisonAttack += upgradePassiveAilmentElement;
		this.stats.passiveSleepAttack += upgradePassiveAilmentElement;
		this.stats.passiveParalysisAttack += upgradePassiveAilmentElement;
		this.stats.passiveBlastAttack += upgradePassiveAilmentElement;
	}

	private updateModifications(modifications: ModificationModel[]) {
		const modGroups = _.groupBy(modifications, 'id');

		for (const key in modGroups) {
			if (modGroups.hasOwnProperty(key)) {
				const value = modGroups[key];

				const level = value[0].levels[value.length - 1];
				if (level) {
					if (level.recoil) { this.stats.recoil += level.recoil; }
					if (level.reload) { this.stats.reload += level.reload; }
					if (level.deviation) { this.stats.deviation += level.deviation; }
				}
			}
		}
	}

	private calculateAttack(weapon: ItemModel) {
		switch (this.stats.element) {
			case ElementType.Fire:
				this.stats.effectivePassiveElementAttack = this.stats.passiveFireAttack;
				this.stats.effectivePassiveElementAttack += this.nearestTen(this.stats.baseElementAttack * (this.stats.passiveFireAttackPercent / 100));
				break;
			case ElementType.Water:
				this.stats.effectivePassiveElementAttack = this.stats.passiveWaterAttack;
				this.stats.effectivePassiveElementAttack += this.nearestTen(this.stats.baseElementAttack * (this.stats.passiveWaterAttackPercent / 100));
				break;
			case ElementType.Thunder:
				this.stats.effectivePassiveElementAttack = this.stats.passiveThunderAttack;
				this.stats.effectivePassiveElementAttack += this.nearestTen(this.stats.baseElementAttack * (this.stats.passiveThunderAttackPercent / 100));
				break;
			case ElementType.Ice:
				this.stats.effectivePassiveElementAttack = this.stats.passiveIceAttack;
				this.stats.effectivePassiveElementAttack += this.nearestTen(this.stats.baseElementAttack * (this.stats.passiveIceAttackPercent / 100));
				break;
			case ElementType.Dragon:
				this.stats.effectivePassiveElementAttack = this.stats.passiveDragonAttack;
				this.stats.effectivePassiveElementAttack += this.nearestTen(this.stats.baseElementAttack * (this.stats.passiveDragonAttackPercent / 100));
				break;
			default:
				break;
		}

		switch (this.stats.ailment) {
			case AilmentType.Poison:
				this.stats.effectivePassiveAilmentAttack = this.stats.passivePoisonAttack;
				// this.stats.effectivePassiveAilmentAttack += this.nearestTen(this.stats.baseAilmentAttack * (this.stats.passivePoisonBuildupPercent / 100));
				this.stats.effectivePassiveAilmentBuildupPercent = this.stats.passivePoisonBuildupPercent;
				break;
			case AilmentType.Sleep:
				this.stats.effectivePassiveAilmentAttack = this.stats.passiveSleepAttack;
				// this.stats.effectivePassiveAilmentAttack += this.nearestTen(this.stats.baseAilmentAttack * (this.stats.passiveSleepBuildupPercent / 100));
				this.stats.effectivePassiveAilmentBuildupPercent = this.stats.passiveSleepBuildupPercent;
				break;
			case AilmentType.Paralysis:
				this.stats.effectivePassiveAilmentAttack = this.stats.passiveParalysisAttack;
				// this.stats.effectivePassiveAilmentAttack += this.nearestTen(this.stats.baseAilmentAttack * (this.stats.passiveParalysisBuildupPercent / 100));
				this.stats.effectivePassiveAilmentBuildupPercent = this.stats.passiveParalysisBuildupPercent;
				break;
			case AilmentType.Blast:
				this.stats.effectivePassiveAilmentAttack = this.stats.passiveBlastAttack;
				// this.stats.effectivePassiveAilmentAttack += this.nearestTen(this.stats.baseAilmentAttack * (this.stats.passiveBlastBuildupPercent / 100));
				this.stats.effectivePassiveAilmentBuildupPercent = this.stats.passiveBlastBuildupPercent;
				break;
			case AilmentType.Stun:
				this.stats.effectivePassiveAilmentAttack = this.stats.passiveStunAttack;
				// this.stats.effectivePassiveAilmentAttack += this.nearestTen(this.stats.baseAilmentAttack * (this.stats.passiveStunBuildupPercent / 100));
				this.stats.effectivePassiveAilmentBuildupPercent = this.stats.passiveStunBuildupPercent;
				break;
			default:
				break;
		}

		if (weapon) {
			this.stats.sharpnessDataNeeded = weapon.sharpnessDataNeeded;
			this.stats.elementHidden = weapon.elementHidden;
			this.stats.ailmentHidden = weapon.ailmentHidden;
			this.stats.extraData = {
				weaponType: weapon.weaponType,
				otherData: weapon.otherData
			};

			const weaponModifier = this.dataService.getWeaponModifier(weapon.weaponType);
			if (weaponModifier) {
				this.stats.weaponAttackModifier = weaponModifier.attackModifier;
				this.stats.critElementModifier = weaponModifier.critElementModifier;
			}
		}

		if (weapon && weapon.sharpnessLevelsBar) {
			this.stats.sharpnessLevelsBar = weapon.sharpnessLevelsBar;
			if (weapon.sharpnessLevelsBar && !isNaN(weapon.sharpnessLevelsBar[0])) {
				let levelsToSubstract = 5 - (this.stats.passiveSharpness / 10);
				let colorIndex = weapon.sharpnessLevelsBar.length - 1;
				for (let i = weapon.sharpnessLevelsBar.length - 1; i >= 0; i--) {
					if (levelsToSubstract > 0) {
						const toSubstract = Math.min(weapon.sharpnessLevelsBar[i], levelsToSubstract);
						if (toSubstract < weapon.sharpnessLevelsBar[i]) {
							colorIndex = i;
						} else if (toSubstract == weapon.sharpnessLevelsBar[i]) {
							colorIndex = i - 1;
						}
						levelsToSubstract -= toSubstract;
					}
					if (weapon.sharpnessLevelsBar[i] == 0) {
						colorIndex = i - 1;
					}
				}

				const sharpnessModifier = this.dataService.getSharpnessModifier(DamageType.Physical, colorIndex);
				if (sharpnessModifier) {
					this.stats.effectivePhysicalSharpnessModifier = sharpnessModifier.value;
				}
				const ElementalSharpnessModifier = this.dataService.getSharpnessModifier(DamageType.Elemental, colorIndex);
				if (ElementalSharpnessModifier) {
					this.stats.effectiveElementalSharpnessModifier = ElementalSharpnessModifier.value;
				}
			}
		}

		const elementAttackIncreaseCap = weapon ? weapon.elementAttackIncreaseCapOverride || this.defaultElementAttackIncreaseCap : this.defaultElementAttackIncreaseCap;
		const ailmentAttackIncreaseCap = weapon ? weapon.elementAttackIncreaseCapOverride || this.defaultElementAttackIncreaseCap : this.defaultElementAttackIncreaseCap;

		if (this.stats.elementHidden) {
			this.stats.effectiveElementAttack = this.nearestTen(Math.round(this.stats.baseElementAttack * this.stats.elementAttackMultiplier));
		} else {
			this.stats.effectiveElementAttack = this.stats.baseElementAttack;
		}

		if (this.stats.ailmentHidden) {
			this.stats.effectiveAilmentAttack = this.nearestTen(Math.round(this.stats.baseAilmentAttack * this.stats.elementAttackMultiplier));
		} else {
			this.stats.effectiveAilmentAttack = this.stats.baseAilmentAttack;
		}

		this.stats.elementCap = this.nearestTen(Math.round(this.stats.effectiveElementAttack + (this.stats.effectiveElementAttack * elementAttackIncreaseCap)));
		this.stats.ailmentCap = this.nearestTen(Math.round(this.stats.effectiveAilmentAttack + (this.stats.effectiveAilmentAttack * ailmentAttackIncreaseCap)));

		this.stats.totalElementAttack = Math.min(this.stats.effectiveElementAttack + this.stats.effectivePassiveElementAttack, this.stats.elementCap);
		this.stats.totalAilmentAttack = Math.min(this.stats.effectiveAilmentAttack + this.stats.effectivePassiveAilmentAttack, this.stats.ailmentCap);

		this.stats.elementCapped = this.stats.totalElementAttack > 0 && (this.stats.effectiveElementAttack + this.stats.effectivePassiveElementAttack) > this.stats.elementCap;
		this.stats.ailmentCapped = this.stats.totalAilmentAttack > 0 && (this.stats.effectiveAilmentAttack + this.stats.effectivePassiveAilmentAttack) > this.stats.ailmentCap;

		if (this.checkElementless()) {
			this.stats.totalAttack =
				Math.round(
					this.stats.attack * (1 + this.stats.elementlessBoostPercent / 100)
					+ this.stats.passiveAttack * this.stats.weaponAttackModifier
				);
			this.stats.totalAttackPotential =
				Math.round(
					this.stats.attack * this.stats.effectivePhysicalSharpnessModifier * (1 + this.stats.elementlessBoostPercent / 100)
					+ (this.stats.passiveAttack + this.stats.activeAttack) * this.stats.weaponAttackModifier
				);
			this.stats.elementless = true;
		} else {
			this.stats.totalAttack =
				this.stats.attack + Math.round(this.stats.passiveAttack * this.stats.weaponAttackModifier);
			this.stats.totalAttackPotential =
				Math.round(
					this.stats.attack * this.stats.effectivePhysicalSharpnessModifier
					+ (this.stats.passiveAttack + this.stats.activeAttack) * this.stats.weaponAttackModifier
				);
			this.stats.elementless = false;
		}

		if (this.stats.elderseal && this.stats.eldersealLevelBoost) {
			const eldersealTypes = Object.keys(EldersealType);
			const currentIndex = eldersealTypes.indexOf(this.stats.elderseal);
			const newIndex = Math.min(currentIndex + this.stats.eldersealLevelBoost, eldersealTypes.length - 1);
			this.stats.elderseal = eldersealTypes[newIndex];
		}
	}

	private checkElementless() {
		if (this.stats.elementlessBoostPercent > 0 && this.stats.totalElementAttack == 0 && this.stats.totalAilmentAttack == 0) {
			if (this.stats.ammoCapacities) {
				const flaming = this.stats.ammoCapacities.ammo.filter(ammo => ammo.name === 'flaming');
				const water = this.stats.ammoCapacities.ammo.filter(ammo => ammo.name === 'water');
				const freeze = this.stats.ammoCapacities.ammo.filter(ammo => ammo.name === 'freeze');
				const thunder = this.stats.ammoCapacities.ammo.filter(ammo => ammo.name === 'thunder');
				const dragon = this.stats.ammoCapacities.ammo.filter(ammo => ammo.name === 'dragon');
				if (
					(flaming.length == 0 || flaming[0].levels[0].capacity == 0)
					&& (water.length == 0 || water[0].levels[0].capacity == 0)
					&& (freeze.length == 0 || freeze[0].levels[0].capacity == 0)
					&& (thunder.length == 0 || thunder[0].levels[0].capacity == 0)
					&& (dragon.length == 0 || dragon[0].levels[0].capacity == 0)
				) {
					return true;
				} else {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	private nearestTen(value: number): number {
		return Math.round(value / 10) * 10;
	}
}

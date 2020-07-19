import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { AugmentationModel } from '../models/augmentation.model';
import { AwakeningLevelModel } from '../models/awakening-level.model';
import { AwakeningModel } from '../models/awakening.model';
import { BuffModel } from '../models/buffs.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { SkillLevelModel } from '../models/skill-level.model';
import { StatsModel } from '../models/stats.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { WeaponModifierModel } from '../models/weapon-modifier.model';
import { AilmentType } from '../types/ailment.type';
import { AmmoType } from '../types/ammo.type';
import { AwakeningType } from '../types/awakening.type';
import { DamageType } from '../types/damage.type';
import { EldersealType } from '../types/elderseal.type';
import { ElementType } from '../types/element.type';
import { ItemType } from '../types/item.type';
import { ModeType } from '../types/mode.type';
import { WeaponType } from '../types/weapon.type';
import { CalculationService } from './calculation.service';
import { DataService } from './data.service';

@Injectable()
export class StatService {
	public statsUpdated$ = new Subject<StatsModel>();

	readonly defaultElementAttackIncreaseCap = 10.0;

	stats = new StatsModel();
	weaponModifier: WeaponModifierModel;

	awakeningsData: AwakeningModel[] = [];

	constructor(
		private dataService: DataService,
		private calcService: CalculationService
	) {
		this.awakeningsData = this.dataService.getAwakenings();
	}

	update(
		skills: EquippedSkillModel[],
		items: ItemModel[],
		augmentations: AugmentationModel[],
		upgradeContainer: UpgradeContainerModel,
		awakenings: AwakeningLevelModel[],
		modifications: ModificationModel[],
		kinsect: KinsectModel,
		buffs: BuffModel
	) {

		this.stats = new StatsModel();

		// ---------------------------- Weapon
		const weapon = items.find(x => x.itemType == ItemType.Weapon);
		if (weapon) {
			this.weaponModifier = this.dataService.getWeaponModifier(weapon.weaponType);

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
		// ---------------------------- Awakenings
		if (weapon && awakenings.length) {
			this.updateAwakenings(weapon, awakenings);
		}
		// ---------------------------- Upgrades
		if (upgradeContainer) {
			this.updateUpgrades(upgradeContainer);
		}
		// ----------------------------
		this.updateItemStats(items, buffs);
		this.updateSkillStats(skills);
		this.updateAugmentations(augmentations);

		this.updateModifications(modifications);

		this.calculateAttack(weapon);

		this.statsUpdated$.next(this.stats);

		this.calcService.updateCalcs(this.stats);
	}

	private updateItemStats(items: ItemModel[], buffs: BuffModel) {
		for (const item of items) {
			if (item.itemType != ItemType.Tool1 && item.itemType != ItemType.Tool2) {
				if (item.baseAttack) {
					this.stats.attack += item.baseAttack;
					this.stats.attack = this.nearestTen(this.stats.attack * 10) / 10;
				}
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

		this.stats.fireResist += (buffs.elementBuff * 5);
		this.stats.waterResist += (buffs.elementBuff * 5);
		this.stats.thunderResist += (buffs.elementBuff * 5);
		this.stats.iceResist += (buffs.elementBuff * 5);
		this.stats.dragonResist += (buffs.elementBuff * 5);
	}

	private updateSkillStats(equippedSkills: EquippedSkillModel[]) {
		for (const equippedSkill of equippedSkills) {
			let level: SkillLevelModel;

			if (equippedSkill.equippedCount) {
				const levelIndex = Math.min(equippedSkill.equippedCount, equippedSkill.skill.levels.length) - 1;
				level = equippedSkill.skill.levels[levelIndex];
			}
			if (level) {
				if (equippedSkill.skill.mode == ModeType.AllSkillActive) {
					const skillUpgrade = equippedSkills.find(x => x.id == 'true' + equippedSkill.id.substring(0, 1).toUpperCase() + equippedSkill.id.substring(1, equippedSkill.id.length));
					if (skillUpgrade == null || skillUpgrade.skill.mode == ModeType.Active) {
						if (level.activeElementAttack) { this.stats.activeElementAttack += level.activeElementAttack; }
						if (level.activeAilmentAttack) { this.stats.activeAilmentAttack += level.activeAilmentAttack; }
						if (level.activeAilmentAttackBuildUpPercent) { this.stats.activeAilmentAttackBuildUpPercent += level.activeAilmentAttackBuildUpPercent; }
						if (level.activeAttack) { this.stats.activeAttack += level.activeAttack; }
						if (level.activeAttackPercent) { this.stats.activeAttackPercent += level.activeAttackPercent; }
						if (level.activeAffinity) { this.stats.activeAffinity += level.activeAffinity; }
						if (level.activeWeakPointAffinity) { this.stats.weakPointAffinity += level.activeWeakPointAffinity; }
						if (level.activeDefense) { this.stats.activeDefense += level.activeDefense; }
						if (equippedSkill.skill.id == 'frostcraft') {
							this.stats.activeAttackPercent += this.weaponModifier.frostcraft[2];
						}
					}
				}
				if (equippedSkill.skill.mode == ModeType.Active || equippedSkill.skill.mode == ModeType.AllSkillActive) {
					if (level.passiveAttack) { this.stats.passiveAttack += level.passiveAttack; }
					if (level.elementlessBoostPercent) { this.stats.elementlessBoostPercent += level.elementlessBoostPercent; }
					if (level.passiveAffinity) { this.stats.passiveAffinity += level.passiveAffinity; }
					if (level.weakPointAffinity) { this.stats.weakPointAffinity += level.weakPointAffinity; }
					if (level.passiveSharpness) { this.stats.passiveSharpness += level.passiveSharpness; }

					if (level.passiveCriticalBoostPercent) { this.stats.passiveCriticalBoostPercent += level.passiveCriticalBoostPercent; }
					if (level.criticalElement) { this.stats.criticalElement = true; }
					if (level.criticalStatus) { this.stats.criticalStatus = true; }
					if (level.trueCriticalElement) { this.stats.trueCriticalElement = true; }
					if (level.trueCriticalStatus) { this.stats.trueCriticalStatus = true; }

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

					if (level.passiveElementResistPercent) { this.stats.passiveElementResistPercent = level.passiveElementResistPercent; }

					if (level.hiddenElementUp) { this.stats.elementAttackMultiplier = level.hiddenElementUp; }
					if (level.ammoUp) { this.stats.ammoUp += level.ammoUp; }
					if (level.eldersealLevelBoost) { this.stats.eldersealLevelBoost = level.eldersealLevelBoost; }
				}
				if (equippedSkill.skill.id == 'hastenRecovery') {
					this.stats.hastenRecovery = 0;
				}
				if (equippedSkill.skill.id == 'frostcraft') {
					this.stats.frostcraft = [];
				}
			}
		}

		if (this.stats.passiveElementResistPercent) {
			this.stats.passiveFireResist += (this.stats.fireResist + this.stats.passiveFireResist) * this.stats.passiveElementResistPercent / 100;
			this.stats.passiveWaterResist += (this.stats.waterResist + this.stats.passiveWaterResist) * this.stats.passiveElementResistPercent / 100;
			this.stats.passiveThunderResist += (this.stats.thunderResist + this.stats.passiveThunderResist) * this.stats.passiveElementResistPercent / 100;
			this.stats.passiveIceResist += (this.stats.iceResist + this.stats.passiveIceResist) * this.stats.passiveElementResistPercent / 100;
			this.stats.passiveDragonResist += (this.stats.dragonResist + this.stats.passiveDragonResist) * this.stats.passiveElementResistPercent / 100;
		}

		const elementConversionSkill = equippedSkills.find(skill => skill.id == 'elementConversion');
		if (elementConversionSkill && elementConversionSkill.skill.mode == ModeType.AllSkillActive) {
			const sumElementalRes =
				this.stats.fireResist + this.stats.passiveFireResist
				+ this.stats.waterResist + this.stats.passiveWaterResist
				+ this.stats.thunderResist + this.stats.passiveThunderResist
				+ this.stats.iceResist + this.stats.passiveIceResist
				+ this.stats.dragonResist + this.stats.passiveDragonResist;
			let elementalBonus = 0;
			if (sumElementalRes >= 15) {
				if (sumElementalRes < 30) {
					elementalBonus = 10;
				} else if (sumElementalRes < 40) {
					elementalBonus = 20;
				} else {
					elementalBonus = Math.floor((sumElementalRes - 30) / 20) * 10 + 20;
				}
			}

			this.stats.baseElementAttack += elementalBonus;
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
		const attackModifier = this.weaponModifier.attackModifier;

		for (const detail of upgradeContainer.upgradeDetails) {
			if (detail.passiveAttack) {
				this.stats.upgradeAttack += detail.passiveAttack;
			}
			if (detail.passiveAffinity) {
				this.stats.affinity += detail.passiveAffinity;
				this.stats.upgradeAffinity += detail.passiveAffinity;
			}
			if (detail.passiveDefense) { this.stats.passiveDefense += detail.passiveDefense; }
			if (detail.healOnHitPercent) { this.stats.healOnHitPercent += detail.healOnHitPercent; }
			if (detail.passiveElement) {
				this.stats.baseElementAttack += detail.passiveElement;
				this.stats.upgradeElementAttack += detail.passiveElement;
			}
			if (detail.passiveAilment) {
				this.stats.baseAilmentAttack += detail.passiveAilment;
				this.stats.upgradeAilmentAttack += detail.passiveAilment;
			}
		}

		let upgradePassiveAttack = 0;
		let upgradePassiveAffinity = 0;
		let upgradePassiveAilmentElement = 0;
		let upgradePassiveDefense = 0;

		let weaponIndex = 0;
		for (const item in WeaponType) {
			if (isNaN(Number(item))) {
				if (item == upgradeContainer.weaponType) {
					break;
				} else {
					weaponIndex += 1;
				}
			}
		}

		const upgrades = this.dataService.getUpgrades();
		for (const [i, customId] of upgradeContainer.customUpgradeIds.entries()) {
			if (customId > 0) {
				const value = upgrades.find(x => x.id == customId).WeaponCustomUpgrades[weaponIndex][i];
				upgradeContainer.customUpgradeValues[i] = value;
				switch (customId) {
					case 1: // Attack
						upgradePassiveAttack += value;
						break;
					case 2: // Affinity
						upgradePassiveAffinity += value;
						break;
					case 3: // Defense
						upgradePassiveDefense += value;
						break;
					case 6: // Element / Ailment
						upgradePassiveAilmentElement += value * 10;
						break;
					case 7: // Sharpness
						this.stats.extraSharpness += value;
						break;
					default:
						break;
				}
			}
		}

		this.stats.upgradeAttack += upgradePassiveAttack;
		this.stats.affinity += upgradePassiveAffinity;
		this.stats.upgradeAffinity += upgradePassiveAffinity;
		this.stats.passiveDefense += upgradePassiveDefense;

		this.stats.baseElementAttack += upgradePassiveAilmentElement;
		this.stats.upgradeElementAttack += upgradePassiveAilmentElement;
		this.stats.baseAilmentAttack += upgradePassiveAilmentElement;
		this.stats.upgradeAilmentAttack += upgradePassiveAilmentElement;
	}

	private updateAwakenings(weapon: ItemModel, awakenings: AwakeningLevelModel[]) {
		let weaponIndex = 0;
		for (const type in WeaponType) {
			if (isNaN(Number(type))) {
				if (type == weapon.weaponType) {
					break;
				} else {
					weaponIndex += 1;
				}
			}
		}
		const attackModifier = this.weaponModifier.attackModifier;

		const awakeningAttack: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Attack).awakenings[weaponIndex];
		const awakeningAffinity: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Affinity).awakenings[0];
		const awakeningDefense: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Defense).awakenings[0];
		const awakeningSlot: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Slot).awakenings[0];
		const awakeningAilment: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Ailment).awakenings[weaponIndex];
		const awakeningElement: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Element).awakenings[weaponIndex];
		const awakeningSharpness: number[] = this.awakeningsData.find(x => x.type == AwakeningType.Sharpness).awakenings[0];

		for (const awakening of awakenings) {
			if (awakening.level > 0) {
				switch (awakening.type) {
					case AwakeningType.Attack:
						this.stats.awakeningAttack += awakeningAttack[awakening.level - 1];
						break;
					case AwakeningType.Affinity:
						this.stats.affinity += awakeningAffinity[awakening.level - 1];
						this.stats.awakeningAffinity += awakeningAffinity[awakening.level - 1];
						break;
					case AwakeningType.Defense:
						break;
					case AwakeningType.Slot:
						break;
					case AwakeningType.Ailment:
						this.stats.baseAilmentAttack += awakeningAilment[awakening.level - 1];
						this.stats.awakeningAilmentAttack += awakeningAilment[awakening.level - 1];
						break;
					case AwakeningType.Element:
						this.stats.baseElementAttack += awakeningElement[awakening.level - 1];
						this.stats.awakeningElementAttack += awakeningElement[awakening.level - 1];
						break;
					case AwakeningType.Sharpness:
						this.stats.extraSharpness += awakeningSharpness[awakening.level - 1];
						break;
					default:
						break;
				}
			}
		}

		const defense = awakenings.find(x => x.type == AwakeningType.Defense);
		if (defense) {
			this.stats.passiveDefense += awakeningDefense[defense.level - 1];
		}
		const slot = awakenings.find(x => x.type == AwakeningType.Slot);
		if (slot) {
			this.stats.extraSlot += awakeningSlot[slot.level - 1];
		}

		if (weapon.weaponType == WeaponType.HuntingHorn) {
			let melodyId = weapon.id;

			const attackMelody = awakenings.find(x => x.type == AwakeningType.AttackMelody);
			if (attackMelody && attackMelody.level > 0) {
				melodyId = this.awakeningsData.find(x => x.type == AwakeningType.AttackMelody).awakenings[0][attackMelody.level - 1];
			}
			const staminaMelody = awakenings.find(x => x.type == AwakeningType.StaminaMelody);
			if (staminaMelody && staminaMelody.level > 0) {
				melodyId = this.awakeningsData.find(x => x.type == AwakeningType.StaminaMelody).awakenings[0][staminaMelody.level - 1];
			}
			const elementalMelody = awakenings.find(x => x.type == AwakeningType.ElementalMelody);
			if (elementalMelody && elementalMelody.level > 0) {
				melodyId = this.awakeningsData.find(x => x.type == AwakeningType.ElementalMelody).awakenings[0][elementalMelody.level - 1];
			}
			const statusMelody = awakenings.find(x => x.type == AwakeningType.StatusMelody);
			if (statusMelody && statusMelody.level > 0) {
				melodyId = this.awakeningsData.find(x => x.type == AwakeningType.StatusMelody).awakenings[0][statusMelody.level - 1];
			}
			const earplugsMelody = awakenings.find(x => x.type == AwakeningType.EarplugsMelody);
			if (earplugsMelody && earplugsMelody.level > 0) {
				melodyId = this.awakeningsData.find(x => x.type == AwakeningType.EarplugsMelody).awakenings[0][earplugsMelody.level - 1];
			}

			weapon.melodies = this.dataService.getMelodiesById(melodyId);
		}

		if (weapon.ammoCapacities) {
			weapon.ammoCapacities = JSON.parse(JSON.stringify(this.dataService.getAmmoCapacities(weapon.id)));

			const awakeningNormalCapacity: number[] = this.awakeningsData.find(x => x.type == AwakeningType.NormalCapacity).awakenings[0];
			const awakeningPierceCapacity: number[] = this.awakeningsData.find(x => x.type == AwakeningType.PierceCapacity).awakenings[0];
			const awakeningSpreadCapacity: number[] = this.awakeningsData.find(x => x.type == AwakeningType.SpreadCapacity).awakenings[0];
			const awakeningElementalCapacity: number[] = this.awakeningsData.find(x => x.type == AwakeningType.ElementalCapacity).awakenings[0];

			const normalCapacity = awakenings.find(x => x.type == AwakeningType.NormalCapacity);
			if (normalCapacity && normalCapacity.level >= 4) {
				const normalAmmo = awakeningNormalCapacity[normalCapacity.level - 1];
				const ammo = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.normal);
				if (ammo) {
					for (const level of ammo.levels) {
						if (level.capacity > 0) {
							level.capacity += normalAmmo;
						}
					}
				}
			}

			const pierceCapacity = awakenings.find(x => x.type == AwakeningType.PierceCapacity);
			if (pierceCapacity && pierceCapacity.level >= 4) {
				const pierceAmmo = awakeningPierceCapacity[pierceCapacity.level - 1];
				const ammo = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.pierce);
				if (ammo) {
					for (const level of ammo.levels) {
						if (level.capacity > 0) {
							level.capacity += pierceAmmo;
						}
					}
				}
			}

			const spreadCapacity = awakenings.find(x => x.type == AwakeningType.SpreadCapacity);
			if (spreadCapacity && spreadCapacity.level >= 4) {
				const spreadAmmo = awakeningSpreadCapacity[spreadCapacity.level - 1];
				const ammo = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.spread);
				if (ammo) {
					for (const level of ammo.levels) {
						if (level.capacity > 0) {
							level.capacity += spreadAmmo;
						}
					}
				}
			}

			const elementalCapacity = awakenings.find(x => x.type == AwakeningType.ElementalCapacity);
			if (elementalCapacity && elementalCapacity.level >= 4) {
				const elementalAmmo = awakeningElementalCapacity[elementalCapacity.level - 1];

				const fire = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.flaming);
				const water = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.water);
				const thunder = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.thunder);
				const ice = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.freeze);
				const dragon = weapon.ammoCapacities.ammo.find(x => x.name == AmmoType.dragon);

				if (fire && fire.levels[0].capacity > 0) {
					fire.levels[0].capacity += elementalAmmo;
				}
				if (water && water.levels[0].capacity > 0) {
					water.levels[0].capacity += elementalAmmo;
				}
				if (thunder && thunder.levels[0].capacity > 0) {
					thunder.levels[0].capacity += elementalAmmo;
				}
				if (ice && ice.levels[0].capacity > 0) {
					ice.levels[0].capacity += elementalAmmo;
				}
				if (dragon && dragon.levels[0].capacity > 0) {
					dragon.levels[0].capacity = Math.min(dragon.levels[0].capacity + elementalAmmo, 3); // Dragon Max = 3
				}
			}
		}
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

			if (this.weaponModifier) {
				this.stats.weaponAttackModifier = this.weaponModifier.attackModifier;
				this.stats.critElementModifier = this.weaponModifier.critElementModifier;
				this.stats.trueCritElementModifier = this.weaponModifier.trueCritElementModifier;
				this.stats.critStatusModifier = this.weaponModifier.critStatusModifier;
				this.stats.trueCritStatusModifier = this.weaponModifier.trueCritStatusModifier;

				if (this.stats.hastenRecovery != null) {
					this.stats.hastenRecovery = this.weaponModifier.hastenRecovery;
				}
				if (this.stats.frostcraft != null) {
					this.stats.frostcraft = this.weaponModifier.frostcraft;
				}
			}
		}

		if (weapon && weapon.sharpnessLevelsBar.length && !isNaN(weapon.sharpnessLevelsBar[0])) {
			this.stats.sharpnessLevelsBar = JSON.parse(JSON.stringify(weapon.sharpnessLevelsBar));
			if (weapon.sharpnessLevelsBar && !isNaN(weapon.sharpnessLevelsBar[0])) {
				// Extra Sharpness
				if (this.stats.extraSharpness > 0) {
					const extraSharpness = this.stats.extraSharpness / 10;

					const total = this.stats.sharpnessLevelsBar.reduce((a, b) => a + b, 0);
					let maxHandicraft = 40 + 5 - total;
					let currentSharpnessIndex = 0;
					for (let i = this.stats.sharpnessLevelsBar.length - 1; i >= 0; i--) {
						if (maxHandicraft > 0) {
							const toSubstract = Math.min(this.stats.sharpnessLevelsBar[i], maxHandicraft);
							if (toSubstract < this.stats.sharpnessLevelsBar[i]) {
								currentSharpnessIndex = i;
							} else if (toSubstract == this.stats.sharpnessLevelsBar[i]) {
								currentSharpnessIndex = i - 1;
							}
							maxHandicraft -= toSubstract;
						}
						if (this.stats.sharpnessLevelsBar[i] == 0) {
							currentSharpnessIndex = i - 1;
						}
					}
					let extraSharpnessAdd = extraSharpness;
					for (let i = currentSharpnessIndex; i < this.stats.sharpnessLevelsBar.length; i++) {
						let toAdd = 0;
						if (i < 6) {
							toAdd = Math.min(12 - this.stats.sharpnessLevelsBar[i], extraSharpnessAdd);
							this.stats.sharpnessLevelsBar[i] += toAdd;
						} else {
							toAdd = extraSharpnessAdd;
							this.stats.sharpnessLevelsBar[i] += toAdd;
						}
						extraSharpnessAdd -= toAdd;
						if (extraSharpnessAdd == 0) {
							break;
						}
					}
					let extraSharpnessRemove = extraSharpness;
					for (let i = 0; i < this.stats.sharpnessLevelsBar.length; i++) {
						const toRemove = Math.min(this.stats.sharpnessLevelsBar[i] - 1, extraSharpnessRemove);
						this.stats.sharpnessLevelsBar[i] -= toRemove;
						extraSharpnessRemove -= toRemove;
						if (extraSharpnessRemove == 0) {
							break;
						}
					}

				}
				// Handicraft
				let levelsToSubstract = 5 - (this.stats.passiveSharpness / 10);
				let colorIndex = this.stats.sharpnessLevelsBar.length - 1;
				for (let i = this.stats.sharpnessLevelsBar.length - 1; i >= 0; i--) {
					if (levelsToSubstract > 0) {
						const toSubstract = Math.min(this.stats.sharpnessLevelsBar[i], levelsToSubstract);
						if (toSubstract < this.stats.sharpnessLevelsBar[i]) {
							colorIndex = i;
						} else if (toSubstract == this.stats.sharpnessLevelsBar[i]) {
							colorIndex = i - 1;
						}
						levelsToSubstract -= toSubstract;
					}
					if (this.stats.sharpnessLevelsBar[i] == 0) {
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

		// this.stats.totalElementAttack = Math.min(this.stats.effectiveElementAttack + this.stats.effectivePassiveElementAttack, this.stats.elementCap);
		// this.stats.totalAilmentAttack = Math.min(this.stats.effectiveAilmentAttack + this.stats.effectivePassiveAilmentAttack, this.stats.ailmentCap);
		// this.stats.elementCapped = this.stats.totalElementAttack > 0 && (this.stats.effectiveElementAttack + this.stats.effectivePassiveElementAttack) > this.stats.elementCap;
		// this.stats.ailmentCapped = this.stats.totalAilmentAttack > 0 && (this.stats.effectiveAilmentAttack + this.stats.effectivePassiveAilmentAttack) > this.stats.ailmentCap;

		this.stats.totalElementAttack =
			this.stats.effectiveElementAttack
			+ this.stats.effectivePassiveElementAttack;
		this.stats.totalElementAttackPotential =
			this.stats.effectiveElementAttack
			+ this.stats.effectivePassiveElementAttack
			+ this.stats.activeElementAttack;
		this.stats.totalElementAttackPotential = this.nearestTen(this.stats.totalElementAttackPotential * 10) / 10;

		this.stats.totalAilmentAttack =
			this.stats.effectiveAilmentAttack * (1 + this.stats.effectivePassiveAilmentBuildupPercent / 100)
			+ this.stats.effectivePassiveAilmentAttack;
		this.stats.totalAilmentAttackPotential =
			this.stats.effectiveAilmentAttack * (1 + this.stats.effectivePassiveAilmentBuildupPercent / 100 + this.stats.activeAilmentAttackBuildUpPercent / 100)
			+ this.stats.effectivePassiveAilmentAttack
			+ this.stats.activeAilmentAttack;
		this.stats.totalAilmentAttack = this.nearestTen(this.stats.totalAilmentAttack * 10) / 10;
		this.stats.totalAilmentAttackPotential = this.nearestTen(this.stats.totalAilmentAttackPotential * 10) / 10;

		const rawAttack = this.stats.attack / this.stats.weaponAttackModifier;
		const elementless = 1 + this.stats.elementlessBoostPercent / 100;
		const attackPercent = 1 + this.stats.activeAttackPercent / 100;
		if (this.checkElementless()) {
			this.stats.totalAttack =
				Math.round(
					Math.round(
						Math.round(rawAttack * elementless)
						+ this.stats.upgradeAttack
						+ this.stats.awakeningAttack
						+ this.stats.passiveAttack
					) * this.stats.weaponAttackModifier
				);
			this.stats.totalAttackPotential =
				Math.round(
					Math.round(
						(
							Math.round(rawAttack * elementless)
							+ this.stats.upgradeAttack
							+ this.stats.awakeningAttack
						) * attackPercent
						+ this.stats.passiveAttack
						+ this.stats.activeAttack
					)
					* this.stats.weaponAttackModifier
				);
			this.stats.elementless = true;
		} else {
			this.stats.totalAttack =
				Math.round(
					Math.floor(
						rawAttack
						+ this.stats.upgradeAttack
						+ this.stats.awakeningAttack
						+ this.stats.passiveAttack
					) * this.stats.weaponAttackModifier
				);
			this.stats.totalAttackPotential =
				Math.round(
					Math.floor(
						(
							rawAttack
							+ this.stats.upgradeAttack
							+ this.stats.awakeningAttack
						) * attackPercent
						+ this.stats.passiveAttack
						+ this.stats.activeAttack
					)
					* this.stats.weaponAttackModifier
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

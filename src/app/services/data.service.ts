import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AmmoCapacitiesModel } from '../models/ammo-capacities.model';
import { AugmentationModel } from '../models/augmentation.model';
import { DecorationModel } from '../models/decoration.model';
import { ItemModel } from '../models/item.model';
import { MelodiesModel } from '../models/melodies.model';
import { SetBonusModel } from '../models/set-bonus.model';
import { SharpnessModifierModel } from '../models/sharpness-modifier.model';
import { SkillReferenceModel } from '../models/skill-reference.model';
import { SkillModel } from '../models/skill.model';
import { WeaponModifierModel } from '../models/weapon-modifier.model';
import { AppDataProvider } from '../providers/app-data.provider';
import { DamageType } from '../types/damage.type';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { WeaponType } from '../types/weapon.type';

@Injectable()
export class DataService {
	constructor(
		private appDataProvider: AppDataProvider
	) { }

	getWeapons(weaponType?: WeaponType): ItemModel[] {
		let result = new Array<ItemModel>();
		if (weaponType) {
			result = this.appDataProvider.appData.weapons.filter(w => w.weaponType == weaponType);
		} else {
			result = this.appDataProvider.appData.weapons;
		}
		for (const weapon of result) {
			weapon.ammoCapacities = this.getAmmoCapacities(weapon.id, weapon.weaponType);
			weapon.melodies = this.getMelodies(weapon.id, weapon.weaponType);
		}
		return result;
	}

	getWeapon(id: number): ItemModel {
		const weapon = _.find(this.appDataProvider.appData.weapons, w => w.id === id);
		weapon.ammoCapacities = this.getAmmoCapacities(weapon.id, weapon.weaponType);
		weapon.melodies = this.getMelodies(weapon.id, weapon.weaponType);
		return weapon;
	}

	getArmor(id: number): ItemModel {
		return _.find(this.appDataProvider.appData.armor, armor => armor.id === id);
	}

	getCharm(id: number): ItemModel {
		return _.find(this.appDataProvider.appData.charms, charm => charm.id === id);
	}

	getArmorByType(type: ItemType): ItemModel[] {
		return _.filter(this.appDataProvider.appData.armor, armor => armor.itemType === type);
	}

	getCharms(): ItemModel[] {
		return this.appDataProvider.appData.charms;
	}

	getDecorations(level?: number): DecorationModel[] {
		let result = new Array<DecorationModel>();
		if (level) {
			result = this.appDataProvider.appData.decorations.filter(d => d.level <= level);
		} else {
			result = this.appDataProvider.appData.decorations;
		}
		return result;
	}

	getSetBonus(id: string): SetBonusModel {
		return _.find(this.appDataProvider.appData.setBonuses, setBonus => setBonus.id === id);
	}

	getSkill(id: string): SkillModel {
		return _.find(this.appDataProvider.appData.skills, skill => skill.id === id);
	}

	getSkills(itemSkills: SkillReferenceModel[]): SkillModel[] {
		return _.filter(this.appDataProvider.appData.skills, skill => {
			return _.some(itemSkills, itemSkill => skill.id == itemSkill.id);
		});
	}

	getWeaponModifier(weaponType: WeaponType): WeaponModifierModel {
		return _.find(this.appDataProvider.appData.weaponModifiers, (mod: WeaponModifierModel) => {
			return mod.type == weaponType;
		});
	}

	getSharpnessModifier(damageType: DamageType, colorIndex: number): SharpnessModifierModel {
		return _.find(this.appDataProvider.appData.sharpnessModifiers, mod => {
			return mod.damageType == damageType && mod.colorIndex == colorIndex;
		});
	}

	getDecoration(id: number): DecorationModel {
		return _.find(this.appDataProvider.appData.decorations, decoration => decoration.id == id);
	}

	getAugmentations(): AugmentationModel[] {
		return this.appDataProvider.appData.augmentations;
	}

	getAugmentation(id: number): AugmentationModel {
		return _.find(this.appDataProvider.appData.augmentations, augmentation => augmentation.id == id);
	}

	getWeaponTypeName(weaponType: WeaponType): string {
		switch (weaponType) {
			case WeaponType.ChargeBlade:
				return 'Charge Blade';
			case WeaponType.DualBlades:
				return 'Dual Blades';
			case WeaponType.GreatSword:
				return 'Great Sword';
			case WeaponType.HeavyBowgun:
				return 'Heavy Bowgun';
			case WeaponType.HuntingHorn:
				return 'Hunting Horn';
			case WeaponType.InsectGlaive:
				return 'Insect Glaive';
			case WeaponType.LightBowgun:
				return 'Light Bowgun';
			case WeaponType.LongSword:
				return 'Long Sword';
			case WeaponType.SwitchAxe:
				return 'Switch Axe';
			case WeaponType.SwordAndShield:
				return 'Sword and Shield';
			default:
				return weaponType;
		}
	}

	getWeaponTypeIcon(weaponType: WeaponType): string {
		return this.getWeaponTypeName(weaponType).toLowerCase().split(' ').join('');
	}

	getEquipmentCategory(itemType: ItemType): EquipmentCategoryType {
		switch (itemType) {
			case ItemType.Weapon:
				return EquipmentCategoryType.Weapon;
			case ItemType.Charm:
				return EquipmentCategoryType.Charm;
			case ItemType.Head:
			case ItemType.Chest:
			case ItemType.Hands:
			case ItemType.Legs:
			case ItemType.Feet:
				return EquipmentCategoryType.Armor;
			default:
				return null;
		}
	}

	private getAmmoCapacities(weaponId: number, weaponType: WeaponType): AmmoCapacitiesModel {
		let result: AmmoCapacitiesModel;
		if (weaponType == WeaponType.LightBowgun || weaponType == WeaponType.HeavyBowgun) {
			result = this.appDataProvider.appData.ammoCapacities.find(c => c.id === weaponId);
		}
		return result;
	}

	private getMelodies(weaponId: number, weaponType: WeaponType): MelodiesModel {
		let result: MelodiesModel;
		if (weaponType == WeaponType.HuntingHorn) {
			result = this.appDataProvider.appData.melodies.find(c => c.id === weaponId);
			if (result) {
				result.melodyEffect = [];
				for (const melody of result.melodiesEffect) {
					result.melodyEffect.push(this.appDataProvider.appData.melodyEffect.find(m => m.id == melody));
				}
			}
		}
		return result;
	}
}

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AmmoCapacitiesModel } from '../models/ammo-capacities.model';
import { AugmentationModel } from '../models/augmentation.model';
import { AwakeningModel } from '../models/awakening.model';
import { DecorationModel } from '../models/decoration.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { MelodiesDetailModel, MelodiesModel } from '../models/melodies.model';
import { ModificationModel } from '../models/modification.model';
import { SetBonusModel } from '../models/set-bonus.model';
import { SharpnessModifierModel } from '../models/sharpness-modifier.model';
import { SkillReferenceModel } from '../models/skill-reference.model';
import { SkillModel } from '../models/skill.model';
import { ToolModel } from '../models/tool.model';
import { UpgradeModel } from '../models/upgrade.model';
import { WeaponModifierModel } from '../models/weapon-modifier.model';
import { AppDataProvider } from '../providers/app-data.provider';
import { AilmentType } from '../types/ailment.type';
import { DamageType } from '../types/damage.type';
import { ElementType } from '../types/element.type';
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
		return result;
	}

	getWeapon(id: number): ItemModel {
		const weapon: ItemModel = _.find(this.appDataProvider.appData.weapons, w => w.id === id);
		if (weapon.weaponType == WeaponType.LightBowgun || weapon.weaponType == WeaponType.HeavyBowgun) {
			weapon.ammoCapacities = this.getAmmoCapacities(weapon.id);
		} else if (weapon.weaponType == WeaponType.HuntingHorn) {
			weapon.melodies = this.getMelodies(weapon.id);
		}
		return weapon;
	}

	getArmors(armorType?: ItemType): ItemModel[] {
		let result = new Array<ItemModel>();
		if (armorType) {
			result = this.appDataProvider.appData.armors.filter(armor => armor.itemType);
		} else {
			result = this.appDataProvider.appData.armors;
		}
		return result;
	}

	getArmor(id: number): ItemModel {
		return _.find(this.appDataProvider.appData.armors, armor => armor.id === id);
	}

	getCharm(id: number): ItemModel {
		return _.find(this.appDataProvider.appData.charms, charm => charm.id === id);
	}

	getTool(id: number, type: ItemType): ItemModel {
		const item = _.find(this.appDataProvider.appData.tools, tool => tool.id === id);
		item.itemType = type;
		return item;
	}

	getArmorByType(type: ItemType): ItemModel[] {
		return _.filter(this.appDataProvider.appData.armors, armor => armor.itemType === type);
	}

	getCharms(): ItemModel[] {
		return this.appDataProvider.appData.charms;
	}

	getTools(type: ItemType): ToolModel[] {
		const items = this.appDataProvider.appData.tools.map(x => Object.assign({}, x));
		_.each(items, tool => {
			tool.itemType = type;
		});
		return items;
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

	getSetBonuses(): SetBonusModel[] {
		return this.appDataProvider.appData.setBonuses.filter(setBonus => setBonus.buildId);
	}

	getSetBonus(id: string): SetBonusModel {
		return _.find(this.appDataProvider.appData.setBonuses, setBonus => setBonus.id === id);
	}

	getSetBonusByBuildId(buildId: number): SetBonusModel {
		return _.find(this.appDataProvider.appData.setBonuses, setBonus => setBonus.buildId === buildId);
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

	getUpgrades(): UpgradeModel[] {
		return this.appDataProvider.appData.upgrades;
	}

	getAwakenings(): AwakeningModel[] {
		return this.appDataProvider.appData.awakenings;
	}
	getAwakening(id: number): AwakeningModel {
		return _.find(this.appDataProvider.appData.awakenings, awakening => awakening.id == id);
	}

	getSafiElementAttack(weaponIndex: number): number {
		let elementAttack = 0;
		const elementAwakening: AwakeningModel = this.appDataProvider.appData.awakenings.find(x => x.id == 6);
		elementAttack = elementAwakening.safiElements[weaponIndex];
		return elementAttack;
	}

	getSafiAilmentAttack(weaponIndex: number, ailmentType: number): number {
		let ailmentAttack = 0;
		const ailmentAwakening = this.appDataProvider.appData.awakenings.find(x => x.id == 5);
		ailmentAttack = ailmentAwakening.safiAilments[weaponIndex][ailmentType];
		return ailmentAttack;
	}

	getSafiElementName(element: ElementType): string {
		let elementName = '';
		switch (element) {
			case ElementType.Fire:
				elementName = 'Hell';
				break;
			case ElementType.Water:
				elementName = 'Aqua';
				break;
			case ElementType.Thunder:
				elementName = 'Bolt';
				break;
			case ElementType.Ice:
				elementName = 'Frost';
				break;
			case ElementType.Dragon:
				elementName = 'Drak';
				break;
			default:
				break;
		}
		return elementName;
	}

	getSafiAilmentName(ailment: AilmentType): string {
		let ailmentName = '';
		switch (ailment) {
			case AilmentType.Paralysis:
				ailmentName = 'Bind';
				break;
			case AilmentType.Sleep:
				ailmentName = 'Dream';
				break;
			case AilmentType.Poison:
				ailmentName = 'Venom';
				break;
			case AilmentType.Blast:
				ailmentName = 'Shatter';
				break;
			default:
				break;
		}
		return ailmentName;
	}

	getSafiName(weaponType: WeaponType): string {
		let name = '';
		switch (weaponType) {
			case WeaponType.GreatSword:
				name = 'splitter';
				break;
			case WeaponType.LongSword:
				name = 'blade';
				break;
			case WeaponType.SwordAndShield:
				name = 'fang';
				break;
			case WeaponType.DualBlades:
				name = 'claws';
				break;
			case WeaponType.Hammer:
				name = 'crusher';
				break;
			case WeaponType.HuntingHorn:
				name = 'horn';
				break;
			case WeaponType.Lance:
				name = 'snout';
				break;
			case WeaponType.Gunlance:
				name = 'buster';
				break;
			case WeaponType.SwitchAxe:
				name = 'axe';
				break;
			case WeaponType.ChargeBlade:
				name = 'shield';
				break;
			case WeaponType.InsectGlaive:
				name = 'spear';
				break;
			case WeaponType.LightBowgun:
				name = 'shot';
				break;
			case WeaponType.HeavyBowgun:
				name = 'cannon';
				break;
			case WeaponType.Bow:
				name = 'bow';
				break;
			default:
				break;
		}
		return name;
	}

	getSafiWeaponName(weaponType: WeaponType, weaponElement: ElementType, weaponAilment: AilmentType): string {
		let weaponName = 'Safi\'s ';

		const safiName = this.getSafiName(weaponType);
		let elementName = '';

		if (weaponElement != ElementType.None) {
			elementName = this.getSafiElementName(weaponElement);
		}

		let ailmentName = '';

		if (weaponAilment != AilmentType.None) {
			ailmentName = this.getSafiAilmentName(weaponAilment);
		}

		if (elementName != '' || ailmentName != '') {
			if (ailmentName == '') {
				weaponName += elementName + safiName;
			} else if (elementName == '') {
				weaponName += ailmentName + safiName;
			} else {
				weaponName += elementName + safiName + '/' + ailmentName + safiName;
			}
		} else {
			weaponName += safiName;
		}
		return weaponName;
	}

	getModifications(): ModificationModel[] {
		return this.appDataProvider.appData.modifications;
	}

	getModification(id: number): ModificationModel {
		return _.find(this.appDataProvider.appData.modifications, modification => modification.id == id);
	}

	getKinsects(): KinsectModel[] {
		return this.appDataProvider.appData.kinsects;
	}

	getKinsect(id: number): KinsectModel {
		return _.find(this.appDataProvider.appData.kinsects, kinsect => kinsect.id == id);
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
			case ItemType.Tool1:
			case ItemType.Tool2:
				return EquipmentCategoryType.Tool;
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

	getElementId(element: ElementType): number {
		let elementId = 0;
		switch (element) {
			case ElementType.Fire:
				elementId = 1;
				break;
			case ElementType.Water:
				elementId = 2;
				break;
			case ElementType.Thunder:
				elementId = 3;
				break;
			case ElementType.Ice:
				elementId = 4;
				break;
			case ElementType.Dragon:
				elementId = 5;
				break;
			default:
				break;
		}
		return elementId;
	}

	getAilmentId(ailment: AilmentType): number {
		let ailmentId = 0;
		switch (ailment) {
			case AilmentType.Paralysis:
				ailmentId = 1;
				break;
			case AilmentType.Sleep:
				ailmentId = 2;
				break;
			case AilmentType.Poison:
				ailmentId = 3;
				break;
			case AilmentType.Blast:
				ailmentId = 4;
				break;
			default:
				break;
		}
		return ailmentId;
	}

	getElement(elementId: number): ElementType {
		let element = null;
		switch (elementId) {
			case 1:
				element = ElementType.Fire;
				break;
			case 2:
				element = ElementType.Water;
				break;
			case 3:
				element = ElementType.Thunder;
				break;
			case 4:
				element = ElementType.Ice;
				break;
			case 5:
				element = ElementType.Dragon;
				break;
			default:
				break;
		}
		return element;
	}

	getAilment(ailmentId: number): AilmentType {
		let ailment = null;
		switch (ailmentId) {
			case 1:
				ailment = AilmentType.Paralysis;
				break;
			case 2:
				ailment = AilmentType.Sleep;
				break;
			case 3:
				ailment = AilmentType.Poison;
				break;
			case 4:
				ailment = AilmentType.Blast;
				break;
			default:
				break;
		}
		return ailment;
	}

	getAmmoCapacities(weaponId: number): AmmoCapacitiesModel {
		return this.appDataProvider.appData.ammoCapacities.find(c => c.id === weaponId);
	}

	getMelodies(weaponId: number): MelodiesModel {
		const result: MelodiesModel = this.appDataProvider.appData.melodies.find(c => c.id === weaponId);
		if (result) {
			result.melodyEffects = [];
			for (let i = 0; i < result.melodies.length; i++) {
				const melodyEffect = new MelodiesDetailModel();
				melodyEffect.melody = result.melodies[i];
				melodyEffect.effects = result.melodiesEffect.filter(e => e.index == i);
				for (const effect of melodyEffect.effects) {
					effect.name = this.appDataProvider.appData.melodyEffect.find(m => m.id == effect.id).name;
				}
				result.melodyEffects.push(melodyEffect);
			}
		}

		return result;
	}
}

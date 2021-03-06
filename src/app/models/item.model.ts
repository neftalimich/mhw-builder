import { AilmentType } from '../types/ailment.type';
import { EldersealType } from '../types/elderseal.type';
import { ElementType } from '../types/element.type';
import { EquipmentCategoryType } from '../types/equipment-category.type';
import { ItemType } from '../types/item.type';
import { WeaponType } from '../types/weapon.type';
import { AmmoCapacitiesModel } from './ammo-capacities.model';
import { MelodiesModel } from './melodies.model';
import { OtherDataModel } from './other-data.model';
import { SkillReferenceModel } from './skill-reference.model';
import { SlotModel } from './slot.model';

export class ItemModel {
	id: number;
	name: string;
	rarity: number;
	itemType: ItemType;
	equipmentCategory: EquipmentCategoryType;
	slots?: SlotModel[];
	defense?: number[];
	levels?: number;

	// weapon properties
	weaponType?: WeaponType;
	baseAttack?: number;
	sharpnessDataNeeded: boolean;
	sharpnessLevelsBar: number[];
	sharpnessMaxLevel?: number;
	sharpnessMaxColorIndex?: number;
	baseAffinityPercent?: number;
	ailment?: AilmentType;
	ailmentBaseAttack: number;
	ailmentHidden: boolean;
	ailmentAttackIncreaseCapOverride: number;
	element?: ElementType;
	elementBaseAttack?: number;
	elementHidden: boolean;
	elementAttackIncreaseCapOverride: number;
	elderseal?: EldersealType;
	otherData?: OtherDataModel[];
	upgradeType?: number;
	ammoCapacities?: AmmoCapacitiesModel;
	melodies?: MelodiesModel;

	// armor properties
	fireResist: number;
	waterResist: number;
	thunderResist: number;
	iceResist: number;
	dragonResist: number;
	skills?: SkillReferenceModel[];

	// tool properties
	duration: number;
	recharge: number;

	monsters?: string[];
	tags?: string[];
	vColor: number;

	equippedLevel?: number;
	active: boolean;
}

import { AmmoCapacitiesModel } from './ammo-capacities.model';
import { AugmentationModel } from './augmentation.model';
import { AwakeningModel } from './awakening.model';
import { DecorationModel } from './decoration.model';
import { ItemModel } from './item.model';
import { KinsectModel } from './kinsect.model';
import { MelodiesModel } from './melodies.model';
import { MelodyEffectModel } from './melody-effect.model';
import { ModificationModel } from './modification.model';
import { SetBonusModel } from './set-bonus.model';
import { SharpnessModifierModel } from './sharpness-modifier.model';
import { SkillModel } from './skill.model';
import { ToolModel } from './tool.model';
import { UpgradeModel } from './upgrade.model';
import { WeaponModifierModel } from './weapon-modifier.model';

export class AppDataModel {
	weaponModifiers: WeaponModifierModel[];
	sharpnessModifiers: SharpnessModifierModel[];
	weapons: ItemModel[];
	armors: ItemModel[];
	charms: ItemModel[];
	tools: ToolModel[];
	setBonuses: SetBonusModel[];
	skills: SkillModel[];
	decorations: DecorationModel[];
	augmentations: AugmentationModel[];
	modifications: ModificationModel[];
	kinsects: KinsectModel[];
	ammoCapacities: AmmoCapacitiesModel[];
	melodies: MelodiesModel[];
	melodyEffect: MelodyEffectModel[];
	upgrades: UpgradeModel[];
	awakenings: AwakeningModel[];

	constructor() {
		this.weaponModifiers = new Array<WeaponModifierModel>();
		this.sharpnessModifiers = new Array<SharpnessModifierModel>();
		this.weapons = new Array<ItemModel>();
		this.armors = new Array<ItemModel>();
		this.charms = new Array<ItemModel>();
		this.setBonuses = new Array<SetBonusModel>();
		this.skills = new Array<SkillModel>();
		this.decorations = new Array<DecorationModel>();
		this.augmentations = new Array<AugmentationModel>();
		this.modifications = new Array<ModificationModel>();
		this.kinsects = new Array<KinsectModel>();
		this.ammoCapacities = new Array<AmmoCapacitiesModel>();
		this.melodies = new Array<MelodiesModel>();
		this.melodyEffect = new Array<MelodyEffectModel>();
		this.tools = new Array<ToolModel>();
		this.upgrades = new Array<UpgradeModel>();
		this.awakenings = new Array<AwakeningModel>();
	}
}

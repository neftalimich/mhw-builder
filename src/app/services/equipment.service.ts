import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AugmentationModel } from '../models/augmentation.model';
import { AwakeningLevelModel } from '../models/awakening-level.model';
import { BuffModel } from '../models/buffs.model';
import { DecorationModel } from '../models/decoration.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { MelodiesModel } from '../models/melodies.model';
import { ModificationModel } from '../models/modification.model';
import { SetBonusModel } from '../models/set-bonus.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { AilmentType } from '../types/ailment.type';
import { EldersealType } from '../types/elderseal.type';
import { ElementType } from '../types/element.type';
import { ItemType } from '../types/item.type';
import { SkillService } from './skill.service';
import { StatService } from './stat.service';

@Injectable()
export class EquipmentService {
	public skills: EquippedSkillModel[];
	public items: ItemModel[];
	public decorations: DecorationModel[];
	public augmentations: AugmentationModel[];
	public upgradeContainer: UpgradeContainerModel;
	public awakenings: AwakeningLevelModel[];
	public awakeningSetbonus: SetBonusModel;
	public modifications: ModificationModel[];
	public kinsect: KinsectModel;
	public buffs: BuffModel;

	constructor(
		private skillService: SkillService,
		private statService: StatService
	) {
		this.items = [];
		this.decorations = [];
		this.augmentations = [];
		this.awakenings = [];
		this.awakeningSetbonus = null;
		this.modifications = [];
		this.buffs = new BuffModel();

		this.skillService.skillsUpdated$.subscribe(skills => {
			this.skills = skills;
			this.statService.update(
				skills,
				this.items,
				this.augmentations,
				this.upgradeContainer,
				this.awakenings,
				this.modifications,
				this.kinsect,
				this.buffs
			);
		});
	}

	addItem(item: ItemModel, updateStats: boolean = true) {
		// console.log("addItem",item);
		this.items.push(item);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addDecoration(decoration: DecorationModel, updateStats: boolean = true) {
		// console.log("addDecoration");
		this.decorations.push(decoration);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addAugmentation(augmentation: AugmentationModel, updateStats: boolean = true) {
		// console.log("addAugmentation");
		this.augmentations.push(augmentation);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addUpgrade(upgradeContainer: UpgradeContainerModel, updateStats: boolean = true) {
		// console.log("addUpgrade");
		this.upgradeContainer = upgradeContainer;
		if (updateStats) {
			this.statService.update(
				this.skills,
				this.items,
				this.augmentations,
				this.upgradeContainer,
				this.awakenings,
				this.modifications,
				this.kinsect,
				this.buffs);
		}
	}

	addAwakenings(awakenings: AwakeningLevelModel[], updateStats: boolean = true) {
		// console.log("addAwakening");
		this.awakenings = awakenings;
		if (awakenings.length && updateStats) {
			this.statService.update(
				this.skills,
				this.items,
				this.augmentations,
				this.upgradeContainer,
				this.awakenings,
				this.modifications,
				this.kinsect,
				this.buffs
			);
		}
	}

	addSetbonus(setbonus: SetBonusModel, updateStats: boolean = true) {
		// console.log("addSetbonus");
		this.awakeningSetbonus = setbonus;
		const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (!weapon.skills.find(skill => skill.id == setbonus.id)) {
			weapon.skills.push({
				id: setbonus.id,
				level: null
			});
		}

		if (updateStats) {
			this.updateSkills();
		}
	}

	addModification(modification: ModificationModel, updateStats: boolean = true) {
		// console.log("addModification");
		this.modifications.push(modification);
		if (updateStats) {
			if (modification.id < 4) {
				this.updateSkills();
			}
		}
	}

	addKinsect(kinsect: KinsectModel, updateStats: boolean = true) {
		// console.log("addKinsect");
		this.kinsect = kinsect;
		if (updateStats) {
			this.statService.update(
				this.skills,
				this.items,
				this.augmentations,
				this.upgradeContainer,
				this.awakenings,
				this.modifications,
				this.kinsect,
				this.buffs
			);
		}
	}

	removeItem(item: ItemModel) {
		// console.log("removeItem");
		if (item && item.itemType == ItemType.Weapon) {
			this.awakenings = [];
		}
		this.items = _.reject(this.items, i => i === item);
		this.updateSkills();
	}

	removeDecoration(decoration: DecorationModel) {
		// console.log("removeDeco");
		this.decorations = _.reject(this.decorations, d => d === decoration);
		this.updateSkills();
	}

	removeAugmentation(augmentation: AugmentationModel) {
		// console.log("RemoveAug");
		this.augmentations = _.reject(this.augmentations, a => a === augmentation);
		this.updateSkills();
	}

	removeUpgrade() {
		// console.log("RemoveUpgrade");
		this.upgradeContainer = null;
		this.updateSkills();
	}

	removeAwakening() {
		// console.log("RemoveAwake");
		this.awakenings = [];
		this.awakeningSetbonus = null;
		this.updateSkills();
	}

	removeSetbonus() {
		// console.log("RemoveSetbonus");
		if (this.awakeningSetbonus && this.awakeningSetbonus.id) {
			const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
			weapon.skills.splice(weapon.skills.findIndex(skill => skill.id == this.awakeningSetbonus.id), 1);
			this.awakeningSetbonus = null;
			this.updateSkills();
		}
	}

	removeMelody() {
		const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
	}

	removeModification(modification: ModificationModel) {
		// console.log("RemoveModification");
		this.modifications = _.reject(this.modifications, a => a === modification);
		this.updateSkills();
	}

	removeKinsect() {
		// console.log("RemoveKin");
		this.kinsect = null;
	}

	changeElement(element: ElementType, elementAttack: number, updateStats: boolean = true) {
		// console.log("changeElement");
		const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (element != ElementType.None) {
			weapon.element = element;
			weapon.elementBaseAttack = elementAttack;
			if (element == ElementType.Dragon) {
				weapon.elderseal = EldersealType.Average;
			}
		} else {
			weapon.element = null;
			weapon.elementBaseAttack = null;
			weapon.elderseal = null;
		}
		if (updateStats) {
			this.statService.update(
				this.skills,
				this.items,
				this.augmentations,
				this.upgradeContainer,
				this.awakenings,
				this.modifications,
				this.kinsect,
				this.buffs
			);
		}
	}

	changeAilment(ailment: AilmentType, ailmentAttack: number, updateStats: boolean = true) {
		// console.log("changeAilment");
		const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (ailment != AilmentType.None) {
			weapon.ailment = ailment;
			weapon.ailmentBaseAttack = ailmentAttack;
		} else {
			weapon.ailment = null;
			weapon.ailmentBaseAttack = null;
		}
		if (updateStats) {
			this.statService.update(
				this.skills,
				this.items,
				this.augmentations,
				this.upgradeContainer,
				this.awakenings,
				this.modifications,
				this.kinsect,
				this.buffs
			);
		}
	}

	changeWeaponName(weaponName: string) {
		// console.log("changeWeaponName");
		const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		weapon.name = weaponName;
	}

	changeWeaponMelody(melodies: MelodiesModel) {
		const weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		weapon.melodies = melodies;
	}

	updateItemLevel() {
		// console.log("updateItemLevel");
		this.updateSkills();
	}

	updateItemActive() {
		// console.log("updateItemActive");
		this.updateSkills();
	}

	updateSkillMode(equippedSkills: EquippedSkillModel[]) {
		// console.log("UpdateSkillMode");
		this.statService.update(
			equippedSkills,
			this.items,
			this.augmentations,
			this.upgradeContainer,
			this.awakenings,
			this.modifications,
			this.kinsect,
			this.buffs
		);
	}

	updateElementBuff(value: number) {
		this.buffs.elementBuff = value;
		this.statService.update(
			this.skills,
			this.items,
			this.augmentations,
			this.upgradeContainer,
			this.awakenings,
			this.modifications,
			this.kinsect,
			this.buffs
		);
	}

	private updateSkills() {
		this.skillService.updateSkills(this.items, this.decorations, this.augmentations);
	}
}

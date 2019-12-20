import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AugmentationModel } from '../models/augmentation.model';
import { AwakeningLevelModel } from '../models/awakening-level.model';
import { DecorationModel } from '../models/decoration.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';
import { AilmentType } from '../types/ailment.type';
import { ElementType } from '../types/element.type';
import { ItemType } from '../types/item.type';
import { SkillService } from './skill.service';
import { StatService } from './stat.service';
import { SetBonusModel } from '../models/set-bonus.model';
import { SkillReferenceModel } from '../models/skill-reference.model';

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

		this.skillService.skillsUpdated$.subscribe(skills => {
			this.skills = skills;
			this.statService.update(skills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
		});
	}

	addItem(item: ItemModel, updateStats: boolean = true) {
		this.items.push(item);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addDecoration(decoration: DecorationModel, updateStats: boolean = true) {
		this.decorations.push(decoration);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addAugmentation(augmentation: AugmentationModel, updateStats: boolean = true) {
		this.augmentations.push(augmentation);
		if (updateStats) {
			this.updateSkills();
		}
	}

	addUpgrade(upgradeContainer: UpgradeContainerModel, updateStats: boolean = true) {
		this.upgradeContainer = upgradeContainer;
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
		}
	}

	addAwakenings(awakenings: AwakeningLevelModel[], updateStats: boolean = true) {
		this.awakenings = awakenings;
		if (awakenings.length && updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
		}
	}

	addSetbonus(setbonus: SetBonusModel, updateStats: boolean = true) {
		this.awakeningSetbonus = setbonus;
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (!weapon.skills.find(skill => skill.id == setbonus.id)) {
			let skillBonus: SkillReferenceModel = {
				id: setbonus.id,
				level: null
			};
			weapon.skills.push(skillBonus);
		}

		if (updateStats) {
			this.updateSkills();
		}
	}

	addModification(modification: ModificationModel, updateStats: boolean = true) {
		this.modifications.push(modification);
		if (updateStats) {
			if (modification.id < 4) {
				this.updateSkills();
			}
		}
	}

	addKinsect(kinsect: KinsectModel, updateStats: boolean = true) {
		this.kinsect = kinsect;
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
		}
	}

	removeItem(item: ItemModel) {
		if (item && item.itemType == ItemType.Weapon) {
			this.awakenings = [];
		}
		this.items = _.reject(this.items, i => i === item);
		this.updateSkills();
	}

	removeDecoration(decoration: DecorationModel) {
		this.decorations = _.reject(this.decorations, d => d === decoration);
		this.updateSkills();
	}

	removeAugmentation(augmentation: AugmentationModel) {
		this.augmentations = _.reject(this.augmentations, a => a === augmentation);
		this.updateSkills();
	}

	removeUpgrade() {
		this.upgradeContainer = null;
		this.updateSkills();
	}

	removeAwakening() {
		this.awakenings = [];
		this.updateSkills();
	}

	removeSetbonus() {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		weapon.skills.splice(weapon.skills.findIndex(skill => skill.id == this.awakeningSetbonus.id), 1);
		this.awakeningSetbonus = null;
		this.updateSkills();
	}

	removeModification(modification: ModificationModel) {
		this.modifications = _.reject(this.modifications, a => a === modification);
		this.updateSkills();
	}

	removeKinsect() {
		this.kinsect = null;
	}

	changeElement(element: ElementType, elementAttack: number, updateStats: boolean = true) {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (element != ElementType.None) {
			weapon.element = element;
			weapon.elementBaseAttack = elementAttack;
		} else {
			weapon.element = null;
			weapon.elementBaseAttack = null;
		}
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
		}
	}

	changeAilment(ailment: AilmentType, ailmentAttack: number, updateStats: boolean = true) {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		if (ailment != AilmentType.None) {
			weapon.ailment = ailment;
			weapon.ailmentBaseAttack = ailmentAttack;
		} else {
			weapon.ailment = null;
			weapon.ailmentBaseAttack = null;
		}
		if (updateStats) {
			this.statService.update(this.skills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
		}
	}

	changeWeaponName(weaponName: string) {
		let weapon = this.items.find(x => x.itemType == ItemType.Weapon);
		weapon.name = weaponName;
	}

	updateItemLevel() {
		this.updateSkills();
	}

	updateItemActive() {
		this.updateSkills();
	}

	updateSkillMode(equippedSkills: EquippedSkillModel[]) {
		this.statService.update(equippedSkills, this.items, this.augmentations, this.upgradeContainer, this.awakenings, this.modifications, this.kinsect);
	}

	private updateSkills() {
		this.skillService.updateSkills(this.items, this.decorations, this.augmentations);
	}
}

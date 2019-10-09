import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AugmentationModel } from '../models/augmentation.model';
import { DecorationModel } from '../models/decoration.model';
import { EquippedSetBonusModel } from '../models/equipped-set-bonus.model';
import { EquippedSkillModel } from '../models/equipped-skill.model';
import { ItemModel } from '../models/item.model';
import { KinsectModel } from '../models/kinsect.model';
import { ModificationModel } from '../models/modification.model';
import { SkillModel } from '../models/skill.model';
import { StatDetailModel } from '../models/stat-detail.model';
import { UpgradeContainerModel } from '../models/upgrade-container.model';

@Injectable()
export class TooltipService {
	public itemChanged$ = new Subject<ItemModel>();
	public decorationChanged$ = new Subject<DecorationModel>();
	public augmentationChanged$ = new Subject<AugmentationModel>();
	public upgradeContainerChanged$ = new Subject<UpgradeContainerModel>();
	public modificationChanged$ = new Subject<ModificationModel>();
	public kinsectChanged$ = new Subject<KinsectModel>();
	public equippedSkillChanged$ = new Subject<EquippedSkillModel>();
	public equippedSetBonusChanged$ = new Subject<EquippedSetBonusModel>();
	public skillChanged$ = new Subject<SkillModel>();
	public calcChanged$ = new Subject<StatDetailModel>();

	public item: ItemModel;
	public decoration: DecorationModel;
	public augmentation: AugmentationModel;
	public upgradeContainer: UpgradeContainerModel;
	public modification: ModificationModel;
	public kinsect: KinsectModel;
	public equippedSkill: EquippedSkillModel;
	public equippedSetBonus: EquippedSetBonusModel;
	public skill: SkillModel;
	public calc: StatDetailModel;

	setItem(item: ItemModel) {
		if (item != this.item) {
			this.reset();
			this.item = item;
			this.itemChanged$.next(item);
		}
	}

	setDecoration(decoration: DecorationModel) {
		if (decoration != this.decoration) {
			this.reset();
			this.decoration = decoration;
			this.decorationChanged$.next(decoration);
		}
	}

	setAugmentation(augmentation: AugmentationModel) {
		if (augmentation != this.augmentation) {
			this.reset();
			this.augmentation = augmentation;
			this.augmentationChanged$.next(augmentation);
		}
	}

	setUpgradeContainer(upgradeContainer: UpgradeContainerModel) {
		if (upgradeContainer != this.upgradeContainer) {
			this.reset();
			this.upgradeContainer = upgradeContainer;
			this.upgradeContainerChanged$.next(upgradeContainer);
		}
	}

	setModification(modification: ModificationModel) {
		if (modification != this.modification) {
			this.reset();
			this.modification = modification;
			this.modificationChanged$.next(modification);
		}
	}

	setKinsect(kinsect: KinsectModel) {
		if (kinsect != this.kinsect) {
			this.reset();
			this.kinsect = kinsect;
			this.kinsectChanged$.next(kinsect);
		}
	}

	setEquippedSkill(equippedSkill: EquippedSkillModel) {
		if (equippedSkill != this.equippedSkill) {
			this.reset();
			this.equippedSkill = equippedSkill;
			this.equippedSkillChanged$.next(equippedSkill);
		}
	}

	setEquippedSetBonus(equippedSetBonus: EquippedSetBonusModel) {
		if (equippedSetBonus != this.equippedSetBonus) {
			this.reset();
			this.equippedSetBonus = equippedSetBonus;
			this.equippedSetBonusChanged$.next(equippedSetBonus);
		}
	}

	setSkill(skill: SkillModel) {
		if (skill != this.skill) {
			this.reset();
			this.skill = skill;
			this.skillChanged$.next(skill);
		}
	}

	setCalc(calc: StatDetailModel) {
		if (calc != this.calc) {
			this.reset();
			this.calc = calc;
			this.calcChanged$.next(calc);
		}
	}

	private reset() {
		this.item = null;
		this.decoration = null;
		this.augmentation = null;
		this.upgradeContainer = null;
		this.modification = null;
		this.kinsect = null;
		this.equippedSkill = null;
		this.equippedSetBonus = null;
		this.skill = null;
		this.calc = null;
	}
}

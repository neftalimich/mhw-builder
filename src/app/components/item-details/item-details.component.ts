import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ItemModel } from '../../models/item.model';
import { SkillModel } from '../../models/skill.model';
import { StatDetailModel } from '../../models/stat-detail.model';
import { DataService } from '../../services/data.service';
import { TooltipService } from '../../services/tooltip.service';
import { EquipmentCategoryType } from '../../types/equipment-category.type';
import { ItemType } from '../../types/item.type';
import { WeaponType } from '../../types/weapon.type';

@Component({
	selector: 'mhw-builder-item-details',
	templateUrl: './item-details.component.html',
	styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
	private _item: ItemModel;

	@Input()
	set item(item: ItemModel) {
		this._item = item;
		if (item) {
			this.setupStats();
			this.loadSkills();
		} else {
			this.skills = new Array<SkillModel>();
		}
	}
	get item(): ItemModel {
		return this._item;
	}

	skills: SkillModel[];
	stats: StatDetailModel[] = [];

	constructor(
		private dataService: DataService,
		private tooltipService: TooltipService
	) { }

	ngOnInit() { }

	setupStats() {
		this.stats = [];

		if (this.item.rarity) {
			this.stats.push({
				name: 'Rarity',
				value: this.item.rarity
			});
		}

		if (this.item.itemType == ItemType.Weapon) {
			this.stats.push({
				name: 'Weapon Type',
				value: this.getWeaponTypeName(this.item.weaponType)
			});

			this.stats.push({
				name: 'Attack',
				value: this.item.baseAttack
			});

			this.stats.push({
				name: 'Affinity',
				value: this.item.baseAffinityPercent
			});

			if (this.item.ailment) {
				this.stats.push({
					name: 'Ailment',
					value: this.item.ailment,
					color: this.item.ailmentHidden ? 'grey' : 'white'
				});

				this.stats.push({
					name: 'Ailment Attack',
					value: this.item.ailmentBaseAttack,
					color: this.item.ailmentHidden ? 'grey' : 'white'
				});
			}

			if (this.item.element) {
				this.stats.push({
					name: 'Element',
					value: this.item.element,
					color: this.item.elementHidden ? 'grey' : 'white'
				});

				this.stats.push({
					name: 'Element Attack',
					value: this.item.elementBaseAttack,
					color: this.item.elementHidden ? 'grey' : 'white'
				});

				if (this.item.elderseal) {
					this.stats.push({
						name: 'Elderseal',
						value: this.item.elderseal
					});
				}
			}

			if (this.item.otherData && this.item.otherData[0].value) {
				const auxDetail: StatDetailModel = {
					name: '',
					value: ''
				};
				switch (this.item.weaponType) {
					case WeaponType.Bow:
						auxDetail.name = 'Coatings';
						break;
					case WeaponType.ChargeBlade:
					case WeaponType.SwitchAxe:
						auxDetail.name = 'Phial Type';
						break;
					case WeaponType.Gunlance:
						auxDetail.name = 'Shell Type';
						break;
					case WeaponType.InsectGlaive:
						auxDetail.name = 'Boost Type';
						break;
					default:
						auxDetail.name = 'Other Data';
						break;
				}
				for (const other of this.item.otherData) {
					auxDetail.value += `${other.value}${other.data ? '-' + other.data : ''}	`;
					if (this.item.otherData.length > 1) {
						auxDetail.value += ' | ';
					}
				}
				this.stats.push(auxDetail);
			}
		}

		if (this.item.itemType == ItemType.Charm) {
			this.stats.push({
				name: 'Levels',
				value: this.item.levels
			});
		}

		if (this.item.itemType == ItemType.Tool1 || this.item.itemType == ItemType.Tool2) {
			this.stats.push({
				name: 'Duration',
				value: this.item.duration
			});
			this.stats.push({
				name: 'Recharge',
				value: this.item.recharge
			});
		}

		if (this.item.defense) {
			let value = '';
			for (let i = 0; i < this.item.defense.length; i++) {
				value += this.item.defense[i];
				if (i < this.item.defense.length - 2) {
					value += ' ➝ ';
				} else if (i < this.item.defense.length - 1) {
					value += ' ➟ ';
				}
			}
			this.stats.push({
				name: 'Defense',
				value: value
			});
		}

		if (this.item.equipmentCategory == EquipmentCategoryType.Armor) {
			this.stats.push({
				name: 'Fire Resist',
				value: this.item.fireResist || 0
			});

			this.stats.push({
				name: 'Water Resist',
				value: this.item.waterResist || 0
			});

			this.stats.push({
				name: 'Thunder Resist',
				value: this.item.thunderResist || 0
			});

			this.stats.push({
				name: 'Ice Resist',
				value: this.item.iceResist || 0
			});

			this.stats.push({
				name: 'Dragon Resist',
				value: this.item.dragonResist || 0
			});
		}

		if (this.item.monsters) {
			this.stats.push({
				name: 'Monsters',
				value: this.item.monsters.join(' | ').replace(/-/g, ' ')
			});
		}
	}


	loadSkills() {
		this.skills = this.dataService.getSkills(this.item.skills);
	}

	getSkillCount(skill: SkillModel): string {
		const itemSkill = _.find(this.item.skills, s => s.id == skill.id);
		const result = `${itemSkill.level}/${skill.levels.length}`;
		return result;
	}

	getWeaponTypeName(weaponType: WeaponType): string {
		return this.dataService.getWeaponTypeName(weaponType);
	}

	clearTooltipItem() {
		this.tooltipService.setItem(null);
	}
}

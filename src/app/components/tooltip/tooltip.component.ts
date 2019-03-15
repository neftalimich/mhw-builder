import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonLevelModel, CommonModel } from 'src/app/models/common.model';
import { DecorationModel } from '../../models/decoration.model';
import { EquippedSetBonusModel } from '../../models/equipped-set-bonus.model';
import { EquippedSkillModel } from '../../models/equipped-skill.model';
import { ItemModel } from '../../models/item.model';
import { SkillModel } from '../../models/skill.model';
import { StatDetailModel } from '../../models/stat-detail.model';
import { TooltipService } from '../../services/tooltip.service';
import { WeaponType } from '../../types/weapon.type';

@Component({
	selector: 'mhw-builder-tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
	@ViewChild('container') container: ElementRef;

	item: ItemModel;
	decoration: DecorationModel;
	common: CommonModel;
	equippedSkill: EquippedSkillModel;
	equippedSetBonus: EquippedSetBonusModel;
	skill: SkillModel;
	calc: StatDetailModel;
	visible: boolean;
	weaponTypes = WeaponType;

	private mouseXOffset = 40;
	private mouseYOffset = 40;

	constructor(
		private renderer: Renderer2,
		private tooltipService: TooltipService
	) { }

	ngOnInit() {
		this.tooltipService.itemChanged$.subscribe(item => {
			if (!item) {
				this.hide();
			} else {
				this.reset();
				this.item = item;
				this.show();
			}
		});

		this.tooltipService.decorationChanged$.subscribe(decoration => {
			if (!decoration) {
				this.hide();
			} else {
				this.reset();
				this.decoration = decoration;
				this.show();
			}
		});

		this.tooltipService.augmentationChanged$.subscribe(augmentation => {
			if (!augmentation) {
				this.hide();
			} else {
				this.reset();
				let levels: CommonLevelModel[] = [];
				for (let augLevel of augmentation.levels) {
					let level: CommonLevelModel;
					level = {
						description: augLevel.description,
						skills: augLevel.skills
					};
					levels.push(level);
				}
				this.common = {
					id: augmentation.id,
					code: augmentation.code,
					name: augmentation.name,
					description: augmentation.description,
					levels: levels
				};
				this.show();
			}
		});

		this.tooltipService.modificationChanged$.subscribe(modification => {
			if (!modification) {
				this.hide();
			} else {
				this.reset();
				let levels: CommonLevelModel[] = [];
				for (let modLevel of modification.levels) {
					let level: CommonLevelModel;
					level = {
						description: modLevel.description,
						skills: modLevel.skills
					};
					levels.push(level);
				}
				this.common = {
					id: modification.id,
					code: modification.code,
					name: modification.name,
					description: modification.description,
					levels: levels
				};
				this.show();
			}
		});

		this.tooltipService.equippedSkillChanged$.subscribe(equippedSkill => {
			if (!equippedSkill) {
				this.hide();
			} else {
				this.reset();
				this.equippedSkill = equippedSkill;
				this.skill = equippedSkill.skill;
				this.show();
			}
		});

		this.tooltipService.equippedSetBonusChanged$.subscribe(equippedSetBonus => {
			if (!equippedSetBonus) {
				this.hide();
			} else {
				this.reset();
				this.equippedSetBonus = equippedSetBonus;
				this.show();
			}
		});

		this.tooltipService.skillChanged$.subscribe(skill => {
			if (!skill) {
				this.hide();
			} else {
				this.reset();
				this.skill = skill;
				this.show();
			}
		});

		this.tooltipService.calcChanged$.subscribe(calc => {
			if (!calc) {
				this.hide();
			} else {
				this.reset();
				this.calc = calc;
				this.show();
			}
		});
	}

	reset() {
		this.item = null;
		this.decoration = null;
		this.common = null;
		this.equippedSkill = null;
		this.equippedSetBonus = null;
		this.skill = null;
		this.calc = null;
	}

	show() {
		this.visible = true;
	}

	hide() {
		this.visible = false;
	}

	move(x: number, y: number) {
		if (this.visible) {
			let newTop = y + this.mouseYOffset;
			let newRight = 0;
			let newLeft = 0;

			if (x < window.innerWidth - (this.container.nativeElement.offsetWidth + this.mouseXOffset)) {
				newLeft = x + this.mouseXOffset;

				if (window.innerWidth < newLeft + this.container.nativeElement.scrollWidth) {
					newLeft = window.innerWidth - this.container.nativeElement.scrollWidth;
				}
			} else {
				newRight = window.innerWidth - x + this.mouseXOffset;

				if (window.innerWidth < newRight + this.container.nativeElement.scrollWidth) {
					newRight = window.innerWidth - this.container.nativeElement.scrollWidth;
				}
			}

			if (window.innerHeight - 20 < newTop + this.container.nativeElement.scrollHeight) {
				newTop = window.innerHeight - this.container.nativeElement.scrollHeight - 20;
			}

			this.renderer.setStyle(this.container.nativeElement, 'left', newLeft ? newLeft + 'px' : 'auto');
			this.renderer.setStyle(this.container.nativeElement, 'right', newRight ? newRight + 'px' : 'auto');
			this.renderer.setStyle(this.container.nativeElement, 'top', newTop + 'px');
		}
	}
}

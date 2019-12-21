import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AwakeningLevelModel } from '../../models/awakening-level.model';
import { KeyValuePair } from '../../models/common/key-value-pair.model';
import { KinsectModel } from '../../models/kinsect.model';
import { SetBonusModel } from '../../models/set-bonus.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { AilmentType } from '../../types/ailment.type';
import { AwakeningType } from '../../types/awakening.type';
import { ElementType } from '../../types/element.type';
import { ItemType } from '../../types/item.type';
import { WeaponType } from '../../types/weapon.type';
import { DropdownComponent } from '../common/dropdown/dropdown.component';

@Component({
	selector: 'mhw-builder-awakening-slot',
	templateUrl: './awakening-slot.component.html',
	styleUrls: ['./awakening-slot.component.scss']
})
export class AwakeningSlotComponent implements OnInit {
	slotName = ItemType.Awakening;
	setbonus: SetBonusModel;

	public selected: boolean;

	private _awakeningsLevel: AwakeningLevelModel[];
	private _weaponElement: ElementType;
	private _weaponAilment: AilmentType;
	private _weaponType: WeaponType;

	weaponIndex = 0;
	elementTypes = ElementType;
	ailmentTypes = AilmentType;
	awakeningTypes = AwakeningType;

	elementValues: KeyValuePair<string, string>[];
	ailmentValues: KeyValuePair<string, string>[];
	awakeningValues: KeyValuePair<number, string>[];

	@Input()
	set awakenings(awakenings: AwakeningLevelModel[]) {
		this._awakeningsLevel = awakenings;
	}
	get awakenings(): AwakeningLevelModel[] {
		return this._awakeningsLevel;
	}

	@Input()
	set weaponElement(weaponElement: ElementType) {
		if (!weaponElement) {
			weaponElement = ElementType.None;
		}
		this._weaponElement = weaponElement;
	}
	get weaponElement(): ElementType {
		return this._weaponElement;
	}

	@Input()
	set weaponAilment(weaponAilment: AilmentType) {
		if (!weaponAilment) {
			weaponAilment = AilmentType.None;
		}
		this._weaponAilment = weaponAilment;
	}
	get weaponAilment(): AilmentType {
		return this._weaponAilment;
	}

	@Input()
	set weaponType(weaponType: WeaponType) {
		this._weaponType = weaponType;

		this.weaponIndex = 0;
		for (const item in WeaponType) {
			if (isNaN(Number(item))) {
				if (item == weaponType) {
					break;
				} else {
					this.weaponIndex += 1;
				}
			}
		}
	}
	get weaponType(): WeaponType {
		return this._weaponType;
	}

	@ViewChild(DropdownComponent, { static: true }) elementDropdown: DropdownComponent;

	constructor(
		private slotService: SlotService,
		private dataService: DataService,
		private tooltipService: TooltipService
	) {
	}

	ngOnInit(): void {
		this.elementValues = [];
		Object.keys(ElementType).map(key => {
			this.elementValues.push({ key: key, value: key });
		});
		this.ailmentValues = [];
		Object.keys(AilmentType).map(key => {
			this.ailmentValues.push({ key: key, value: key });
		});
		this.awakeningValues = [];
		Object.keys(AwakeningType).map((key, index) => {
			this.awakeningValues.push({ key: index, value: key });
		});
	}

	clicked() {
		this.slotService.selectSetbonusSlot(this);
	}

	clearSkillClicked(event: Event) {
		//event.stopPropagation();
		//this.slotService.clearAwakeningSlot(this);
		//this.clearTooltipWeaponMod();
	}

	setTooltipKinsect(event: PointerEvent, kinsect: KinsectModel) {
		//if (event.pointerType == PointerType.Mouse) {
		//	this.tooltipService.setKinsect(weaponMod);
		//}
	}

	clearTooltipKinsect() {
		//this.tooltipService.setKinsect(null);
	}

	selectElement(selectedElement: ElementType) {
		this.weaponElement = selectedElement;
		let elementAttack = this.dataService.getSafiElementAttack(this.weaponIndex);
		this.changeWeaponName();
		this.slotService.selectWeaponElement(selectedElement, elementAttack);
	}
	selectAilment(selectedAilment: AilmentType) {
		this.weaponAilment = selectedAilment;
		let ailmentType = 0;
		if (selectedAilment == AilmentType.Poison || selectedAilment == AilmentType.Blast) {
			ailmentType = 1;
		}
		let ailmentAttack = this.dataService.getSafiAilmentAttack(this.weaponIndex, ailmentType);
		this.changeWeaponName();
		this.slotService.selectWeaponAilment(selectedAilment, ailmentAttack);
	}

	private changeWeaponName() {
		this.slotService.changeWeaponName(this.dataService.getSafiWeaponName(this.weaponType, this.weaponElement, this.weaponAilment));
	}

	selectAwakeningType(selectedAwakening: KeyValuePair<number, string>, awakeningLevel: AwakeningLevelModel) {
		awakeningLevel.id = selectedAwakening.key;
		awakeningLevel.type = AwakeningType[selectedAwakening.value];
		this.slotService.selectAwakenings(this.awakenings);
	}

	selectAwakeningLevel(level: number, awakeningLevel: AwakeningLevelModel) {
		if (awakeningLevel.type != AwakeningType.None) {
			if (awakeningLevel.level == level) {
				awakeningLevel.level -= 1;
			} else {
				awakeningLevel.level = level;
			}
		}
		this.slotService.selectAwakenings(this.awakenings);
	}

	getElementIcon(element: ElementType): string {
		let assetPath;
		if (element && element != ElementType.None) {
			assetPath = `${element.toLowerCase()}-icon`;
		}
		return `assets/images/${assetPath}.png`;
	}
	getAilmentIcon(ailment: AilmentType): string {
		let assetPath;
		if (ailment && ailment != AilmentType.None) {
			assetPath = `${ailment.toLowerCase()}-icon`;
		}
		return `assets/images/${assetPath}.png`;
	}
}

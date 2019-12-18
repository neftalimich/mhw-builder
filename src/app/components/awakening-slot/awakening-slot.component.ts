import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AwakeningLevelModel } from '../../models/awakening-level.model';
import { AwakeningModel } from '../../models/awakening.model';
import { KeyValuePair } from '../../models/common/key-value-pair.model';
import { KinsectModel } from '../../models/kinsect.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { AilmentType } from '../../types/ailment.type';
import { ElementType } from '../../types/element.type';
import { WeaponType } from '../../types/weapon.type';
import { DropdownComponent } from '../common/dropdown/dropdown.component';

@Component({
	selector: 'mhw-builder-awakening-slot',
	templateUrl: './awakening-slot.component.html',
	styleUrls: ['./awakening-slot.component.scss']
})
export class AwakeningSlotComponent implements OnInit {
	private _awakeningsLevel: AwakeningLevelModel[];
	private _weaponElement: ElementType;
	private _weaponAilment: AilmentType;
	private _weaponType: WeaponType;

	weaponIndex = 0;
	elementTypes = ElementType;
	ailmentTypes = AilmentType;
	elements: KeyValuePair<string, string>[];
	ailments: KeyValuePair<string, string>[];
	awakenings: AwakeningModel[];

	@Input()
	set awakeningsLevel(awakenings: AwakeningLevelModel[]) {
		this._awakeningsLevel = awakenings;
	}
	get awakeningsLevel(): AwakeningLevelModel[] {
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

	public selected: boolean;

	@ViewChild(DropdownComponent, { static: true }) elementDropdown: DropdownComponent;

	constructor(
		private slotService: SlotService,
		private dataService: DataService,
		private tooltipService: TooltipService
	) {
		this.awakenings = dataService.getAwakenings();
	}

	ngOnInit(): void {
		this.elements = [];
		Object.keys(ElementType).map(key => {
			this.elements.push({ key: key, value: key });
		});
		this.ailments = [];
		Object.keys(AilmentType).map(key => {
			this.ailments.push({ key: key, value: key });
		});
	}

	clicked() {
		//this.slotService.selectAwakeningSlot(this);
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

	selectAwakeningType(selectedAwakening: any, awakening: AwakeningLevelModel) {
		awakening.id = selectedAwakening.id;
		awakening.type = selectedAwakening.type;
	}
	selectAwakeningLevel(level, awakening: AwakeningLevelModel) {
		if (awakening.id != 0) {
			if (awakening.level == level) {
				awakening.level -= 1;
			} else {
				awakening.level = level;
			}
		}
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

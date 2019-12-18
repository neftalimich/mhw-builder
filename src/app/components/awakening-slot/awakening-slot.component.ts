import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AwakeningLevelModel } from '../../models/awakening-level.model';
import { KeyValuePair } from '../../models/common/key-value-pair.model';
import { KinsectModel } from '../../models/kinsect.model';
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
	elementTypes = ElementType;
	ailmentTypes = AilmentType;
	elements: KeyValuePair<string, string>[];
	ailments: KeyValuePair<string, string>[];

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
	}
	get weaponType(): WeaponType {
		return this._weaponType;
	}

	public selected: boolean;

	@ViewChild(DropdownComponent, { static: true }) elementDropdown: DropdownComponent;

	constructor(
		private slotService: SlotService,
		private tooltipService: TooltipService
	) { }

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
		console.log(selectedElement);
		this.weaponElement = selectedElement;
		this.slotService.selectWeaponElement(selectedElement);
		//this.kinsect.element = selectedElement;
		//this.slotService.selectAwakeningSlot(this);
		//this.slotService.selectKinsect(this.kinsect);
	}
	selectAilment(selectedAilment: AilmentType) {
		this.weaponAilment = selectedAilment;
		this.slotService.selectWeaponAilment(selectedAilment);
		//this.kinsect.element = selectedElement;
		//this.slotService.selectAwakeningSlot(this);
		//this.slotService.selectKinsect(this.kinsect);
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

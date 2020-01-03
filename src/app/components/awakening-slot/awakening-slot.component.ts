import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AwakeningLevelModel } from '../../models/awakening-level.model';
import { KeyValuePair } from '../../models/common/key-value-pair.model';
import { SetBonusModel } from '../../models/set-bonus.model';
import { DataService } from '../../services/data.service';
import { SlotService } from '../../services/slot.service';
import { TooltipService } from '../../services/tooltip.service';
import { AilmentType } from '../../types/ailment.type';
import { AwakeningType } from '../../types/awakening.type';
import { ElementType } from '../../types/element.type';
import { ItemType } from '../../types/item.type';
import { PointerType } from '../../types/pointer.type';
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
	melody: any = null;

	public selected: boolean;

	private _awakeningsLevel: AwakeningLevelModel[];
	private _weaponElement: ElementType;
	private _weaponAilment: AilmentType;
	private _weaponType: WeaponType;

	weaponIndex = 0;
	elementTypes = ElementType;
	ailmentTypes = AilmentType;
	awakeningTypes = AwakeningType;
	weaponTypes = WeaponType;

	elementValues: KeyValuePair<string, string>[];
	ailmentValues: KeyValuePair<string, string>[];
	awakeningValues: KeyValuePair<number, string>[];
	melodyValues: any[] = [];

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
		this.initAwakeningValues();
		if (weaponType == WeaponType.Bow) {
			this.awakeningValues.splice(7, 5);
		} else if (weaponType != WeaponType.LightBowgun && weaponType != WeaponType.HeavyBowgun) {
			this.awakeningValues.splice(8, 4);
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
		this.ailmentValues.pop();

		this.melodyValues.push({ level: 0, name: 'Melody', melodyId: 4046 });
		this.melodyValues.push({ level: 2, name: 'Attack Melody I', melodyId: 2189 });
		this.melodyValues.push({ level: 3, name: 'Attack Melody II', melodyId: 2183 });
		this.melodyValues.push({ level: 4, name: 'Attack Melody III', melodyId: 2169 });
		this.melodyValues.push({ level: 5, name: 'Attack Melody IV', melodyId: 2211 });

		this.melodyValues.push({ level: 2, name: 'Stamina Melody I', melodyId: 2195 });
		this.melodyValues.push({ level: 3, name: 'Stamina Melody II', melodyId: 2178 });
		this.melodyValues.push({ level: 4, name: 'Stamina Melody III', melodyId: 2186 });
		this.melodyValues.push({ level: 5, name: 'Stamina Melody IV', melodyId: 2230 });

		this.melodyValues.push({ level: 2, name: 'Elemental Melody I', melodyId: 2215 });
		this.melodyValues.push({ level: 3, name: 'Elemental Melody II', melodyId: 2229 });
		this.melodyValues.push({ level: 4, name: 'Elemental Melody III', melodyId: 2231 });
		this.melodyValues.push({ level: 5, name: 'Elemental Melody IV', melodyId: 2176 });

		this.melodyValues.push({ level: 2, name: 'Status Melody', melodyId: 2219 });
		this.melodyValues.push({ level: 2, name: 'Earplugs Melody', melodyId: 2171 });
	}

	initAwakeningValues() {
		this.awakeningValues = [];
		Object.keys(AwakeningType).map((key, index) => {
			this.awakeningValues.push({ key: index, value: key });
		});
	}

	clicked() {
		this.slotService.selectSetbonusSlot(this);
	}

	clearAwakeninsClicked(even: Event) { }

	clearSkillClicked(event: Event) {
		this.setbonus = null;
		event.stopPropagation();
		this.slotService.clearSkillSlot(this);
	}

	setTooltipAwakening(event: PointerEvent, awakenins: AwakeningLevelModel[]) {
		if (event.pointerType == PointerType.Mouse) {
		}
	}

	clearTooltipAwakening() {
	}

	selectElement(selectedElement: ElementType) {
		this.weaponElement = selectedElement;
		const elementAttack = this.dataService.getSafiElementAttack(this.weaponIndex);
		this.changeWeaponName();
		this.slotService.selectWeaponElement(selectedElement, elementAttack);
	}
	selectAilment(selectedAilment: AilmentType) {
		this.weaponAilment = selectedAilment;
		let ailmentType = 0;
		if (selectedAilment == AilmentType.Poison || selectedAilment == AilmentType.Blast) {
			ailmentType = 1;
		}
		const ailmentAttack = this.dataService.getSafiAilmentAttack(this.weaponIndex, ailmentType);
		this.changeWeaponName();
		this.slotService.selectWeaponAilment(selectedAilment, ailmentAttack);
	}

	private changeWeaponName() {
		this.slotService.changeWeaponName(this.dataService.getSafiWeaponName(this.weaponType, this.weaponElement, this.weaponAilment));
	}

	selectAwakeningType(selectedAwakening: KeyValuePair<number, string>, awakeningLevel: AwakeningLevelModel, index: number) {
		awakeningLevel.id = selectedAwakening.key;
		awakeningLevel.type = AwakeningType[selectedAwakening.value];
		awakeningLevel.level = awakeningLevel.level != 0 ? awakeningLevel.level : (index == 0 ? 6 : 5);
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

	selectMelodyType(melody: any) {
		this.melody = melody;
		this.slotService.changeWeaponMelody(this.dataService.getMelodies(melody.melodyId));
	}

	clearMelodyClicked(event: Event) {
		event.stopPropagation();
		this.melody = this.melodyValues[0];
		this.slotService.changeWeaponMelody(this.dataService.getMelodies(this.melody.melodyId));
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

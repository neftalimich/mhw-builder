import { Component, OnInit, ViewChild } from '@angular/core';
import { KinsectModel } from 'src/app/models/kinsect.model';
import { AmmoCapacitiesModel } from '../../models/ammo-capacities.model';
import { CalculationVariableModel } from '../../models/calculation-variable.model';
import { ExtraDataModel } from '../../models/extra-data.model';
import { SharpnessBarModel } from '../../models/sharpness-bar.model';
import { StatDetailModel } from '../../models/stat-detail.model';
import { CalculationService } from '../../services/calculation.service';
import { TooltipService } from '../../services/tooltip.service';
import { PointerType } from '../../types/pointer.type';
import { SharpnessBarComponent } from '../sharpness-bar/sharpness-bar.component';

@Component({
	selector: 'mhw-builder-equipped-stats',
	templateUrl: './equipped-stats.component.html',
	styleUrls: ['./equipped-stats.component.scss']
})

export class EquippedStatsComponent implements OnInit {

	attackCalcs = new Array<StatDetailModel>();
	defenseCalcs = new Array<StatDetailModel>();
	ammoCapacities: AmmoCapacitiesModel;
	kinsect: KinsectModel;
	sharpnessBar: SharpnessBarModel;
	extraData: ExtraDataModel;

	attackVisible: boolean;
	ammoVisible: boolean;
	kinsectVisible: boolean;
	defenseVisible: boolean;

	@ViewChild(SharpnessBarComponent, { static: false }) sharpnessBarComponent: SharpnessBarComponent;

	constructor(
		private calculationService: CalculationService,
		private tooltipService: TooltipService
	) { }

	ngOnInit() {
		this.calculationService.attackCalcsUpdated$.subscribe(calcs => {
			this.attackCalcs = calcs;
		});

		this.calculationService.ammoUpdated$.subscribe(ammo => {
			this.ammoCapacities = ammo;
		});

		this.calculationService.kinsectUpdated$.subscribe(kinsect => {
			this.kinsect = kinsect;
		});

		this.calculationService.sharpnessUpdated$.subscribe(sharp => {
			this.sharpnessBar = sharp;
		});

		this.calculationService.extraDataUpdated$.subscribe(extraData => {
			this.extraData = extraData;
		});

		this.calculationService.defenseCalcsUpdated$.subscribe(calcs => {
			this.defenseCalcs = calcs;
		});

		this.attackVisible = true;
		this.ammoVisible = true;
		this.kinsectVisible = true;
		this.defenseVisible = true;
	}

	showCalcDetails(event: PointerEvent, calc: StatDetailModel) {
		if (event.pointerType == PointerType.Mouse) {
			if (calc.calculationTemplate || (calc.info && calc.info.length)) {
				this.tooltipService.setCalc(calc);
			}
		}
	}

	clearCalcDetails() {
		this.tooltipService.setCalc(null);
	}

	showOnClickCalcDetails(calc: StatDetailModel) {
		if (calc.calculationTemplate || (calc.info && calc.info.length)) {
			this.tooltipService.setCalc(calc);
		} else {
			this.clearCalcDetails();
		}
	}

	showSharpDetails(event: PointerEvent) {
		if (event.pointerType == PointerType.Mouse) {
			this.setSharpTooltip(this.sharpnessBarComponent.sharpnessBar);
		}
	}

	showOnClickSharpDetails() {
		this.setSharpTooltip(this.sharpnessBarComponent.sharpnessBar);
	}

	clearSharpDetails() {
		this.tooltipService.setCalc(null);
	}

	showExtraDetails(event: PointerEvent) {
		if (event.pointerType == PointerType.Mouse) {
			this.setExtraDatailsTooltip();
		}
	}
	showOnClickExtraDetails(event: PointerEvent) {
		this.setExtraDatailsTooltip();
	}

	clearExtraDetails() {
		this.tooltipService.setCalc(null);
	}

	private setExtraDatailsTooltip() {
		const calculationVariables: CalculationVariableModel[] = [];
		for (const other of this.extraData.otherData) {
			const variable: CalculationVariableModel = {
				displayName: other.value,
				name: other.value,
				colorClass: 'white',
				value: other.data
			};
			calculationVariables.push(variable);
		}
		const otherDetail: StatDetailModel = {
			name: 'Weapon Info',
			value: '',
			calculationTemplate: '',
			calculationVariables: calculationVariables,
			info: []
		};

		this.tooltipService.setCalc(otherDetail);
	}

	private setSharpTooltip(sharp: SharpnessBarModel) {
		if (sharp.levels) {
			const sharpDetail: StatDetailModel = {
				name: 'Sharpness',
				value: sharp.tooltipTemplate,
				calculationTemplate: sharp.tooltipTemplate,
				calculationVariables: [],
				info: []
			};
			if (sharp.sharpnessDataNeeded) {
				sharpDetail.info.push('Missing data for this weapon! Sharpness values are probably incorrect!');
			}

			this.tooltipService.setCalc(sharpDetail);
		} else {
			this.clearSharpDetails();
		}
	}
}

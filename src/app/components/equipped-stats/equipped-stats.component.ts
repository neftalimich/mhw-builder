import { Component, OnInit } from '@angular/core';
import { StatDetailModel } from '../../models/stat-detail.model';
import { CalculationService } from '../../services/calculation.service';
import { TooltipService } from '../../services/tooltip.service';
import { PointerType } from '../../types/pointer.type';
import { AmmoCapacitiesModel } from '../../models/ammo-capacities.model';
import { SharpnessBarModel } from '../../models/sharpness-bar.model';

@Component({
	selector: 'mhw-builder-equipped-stats',
	templateUrl: './equipped-stats.component.html',
	styleUrls: ['./equipped-stats.component.scss']
})

export class EquippedStatsComponent implements OnInit {

	attackCalcs = new Array<StatDetailModel>();
	defenseCalcs = new Array<StatDetailModel>();
	ammoCapacities: AmmoCapacitiesModel;
	sharpnessBar: SharpnessBarModel;

	attackVisible: boolean;
	detailsVisible: boolean;
	defenseVisible: boolean;

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

		this.calculationService.sharpnessUpdated$.subscribe(sharp => {
			this.sharpnessBar = sharp;
		});

		this.calculationService.defenseCalcsUpdated$.subscribe(calcs => {
			this.defenseCalcs = calcs;
		});

		this.attackVisible = true;
		this.detailsVisible = true;
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

	showSharpDetails(event: PointerEvent, sharp: SharpnessBarModel) {
		if (event.pointerType == PointerType.Mouse) {
			this.setSharpTooltip(sharp);
		}
	}

	clearSharpDetails() {
		this.tooltipService.setCalc(null);
	}

	showOnClickSharpDetails(sharp: SharpnessBarModel) {
		this.setSharpTooltip(sharp);
	}

	private setSharpTooltip(sharp: SharpnessBarModel) {
		if (sharp.levels) {
			const sharpDetail: StatDetailModel = {
				name: 'Sharpness',
				value: sharp.tooltipTemplate,
				calculationTemplate: sharp.tooltipTemplate,
				calculationVariables: []
			};
			this.tooltipService.setCalc(sharpDetail);
		} else {
			this.clearSharpDetails();
		}
	}
}

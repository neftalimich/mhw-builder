import { Component, Input, OnInit } from '@angular/core';
import { StatDetailModel } from '../../models/stat-detail.model';
import { TooltipService } from '../../services/tooltip.service';

@Component({
	selector: 'mhw-builder-calc-details',
	templateUrl: './calc-details.component.html',
	styleUrls: ['./calc-details.component.scss'],
})
export class CalcDetailsComponent implements OnInit {

	private _calc: StatDetailModel;
	@Input()
	public set calc(calc: StatDetailModel) {
		this._calc = calc;
		this.generateTemplate();
	}
	public get calc() { return this._calc; }

	detailTemplate: string;

	constructor(
		private tooltipService: TooltipService
	) { }

	ngOnInit(): void {
	}

	clearCalc() {
		this.tooltipService.setCalc(null);
	}

	generateTemplate() {
		this.detailTemplate = null;

		if (this.calc.calculationTemplate) {
			let template = this.calc.calculationTemplate;
			for (const item of this.calc.calculationVariables) {
				template = template.split(`{${item.name}}`).join(`<span class="${item.colorClass}">${item.value}</span>`);
			}

			this.detailTemplate = template;
		}
	}
}

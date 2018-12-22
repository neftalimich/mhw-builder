import { Component, OnInit, Input } from '@angular/core';
import { SharpnessModel } from 'src/app/models/sharpness-model';
import { SharpnessBarModel } from 'src/app/models/sharpness-bar.model';
import { PointerType } from 'src/app/types/pointer.type';
import { StatDetailModel } from 'src/app/models/stat-detail.model';
import { TooltipService } from 'src/app/services/tooltip.service';

@Component({
	selector: 'mhw-builder-sharpness-bar',
	templateUrl: './sharpness-bar.component.html',
	styleUrls: ['./sharpness-bar.component.scss']
})
export class SharpnessBarComponent implements OnInit {
	private _handicraftLevel: number;
	private _sharpnessLevels: number[] = [];

	@Input()
	set handicraftLevel(handicraftLevel: number) {
		this._handicraftLevel = handicraftLevel;
	}
	get handicraftLevel(): number {
		return this._handicraftLevel;
	}

	@Input()
	set sharpnessLevels(sharpnessLevels: number[]) {

		this._sharpnessLevels = sharpnessLevels;
		this.generateSharpnessBar();
	}
	get sharpnessLevels(): number[] {
		return this._sharpnessLevels;
	}
	

	sharpnessBar: SharpnessBarModel = new SharpnessBarModel();

	constructor(private tooltipService: TooltipService) {
		
	}

	ngOnInit() {
		console.log(this._sharpnessLevels, this._handicraftLevel)
		this.generateSharpnessBar();
	}

	generateSharpnessBar() {
		let total = this._sharpnessLevels.reduce((a, b) => a + b, 0);
		const maxHandicraftLevels = 40 + 5 - total;
		this.sharpnessBar.tooltipTemplate = '';
		this.sharpnessBar.sharps = [];
		this.sharpnessBar.levels = JSON.parse(JSON.stringify(this._sharpnessLevels));
		this.sharpnessBar.maxColorSharp = null;

		let levelsToSubstract = Math.min(5 - this._handicraftLevel, maxHandicraftLevels);
		let levelsToAdd = Math.min(this._handicraftLevel, maxHandicraftLevels);
		const sharpnessEmpty = levelsToSubstract;
		let last = true;

		for (let i = this._sharpnessLevels.length - 1; i >= 0; i--) {
			if (this.sharpnessBar.maxColorSharp == null && this._sharpnessLevels[i] > 0) {
				this.sharpnessBar.maxColorSharp = i;
				this.sharpnessBar.maxLevelSharp = this._sharpnessLevels[i];
			}
			if (levelsToSubstract > 0) {
				const toSubstract = Math.min(this._sharpnessLevels[i], levelsToSubstract);
				this._sharpnessLevels[i] -= toSubstract;
				levelsToSubstract -= toSubstract;
			}
			const aux = Math.min(this._sharpnessLevels[i], levelsToAdd);

			if (levelsToAdd > 0) {
				const sharpnessAux: SharpnessModel = {
					colorIndex: i,
					level: aux,
					active: true,
					last: last
				};
				last = false;
				if (levelsToAdd - aux == 0) {
					sharpnessAux.first = true;
				}
				this.sharpnessBar.sharps.push(sharpnessAux);
			}
			if (levelsToAdd < this._sharpnessLevels[i]) {
				const sharpnessAux: SharpnessModel = {
					colorIndex: i,
					level: this._sharpnessLevels[i] - levelsToAdd,
					active: false
				};
				this.sharpnessBar.sharps.push(sharpnessAux);
			}
			levelsToAdd -= aux;

			// When handicraft is not needed
			if (total > 40 && this._sharpnessLevels[i] > 0) {
				const toSubstract2 = Math.min(this._sharpnessLevels[i], total - 40);
				this._sharpnessLevels[i] -= toSubstract2;
				total -= toSubstract2;
			}
			this.sharpnessBar.tooltipTemplate =
				`| <span class="sharp-${i}">${this._sharpnessLevels[i] * 10}</span> ${this.sharpnessBar.tooltipTemplate}`;
		}

		this.sharpnessBar.sharps = this.sharpnessBar.sharps.reverse();
		this.sharpnessBar.empty = sharpnessEmpty;
		this.sharpnessBar.widthModifier = 3.5;
		this.sharpnessBar.levelsMissing = 6 - this._sharpnessLevels.length;
		this.sharpnessBar.tooltipTemplate +=
			` | = <span class="sharp-8"> ${((total - sharpnessEmpty) * 10)}`
			+ ` [<span class="sharp-${this.sharpnessBar.maxColorSharp}">${this.sharpnessBar.maxLevelSharp * 10}<i class="fas fa-circle fa-sm"></i></span>]</span>`;
	}


	showSharpDetails(event: PointerEvent) {
		if (event.pointerType == PointerType.Mouse) {
			this.setSharpTooltip(this.sharpnessBar);
		}
	}

	showOnClickSharpDetails() {
		this.setSharpTooltip(this.sharpnessBar);
	}

	clearSharpDetails() {
		this.tooltipService.setCalc(null);
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

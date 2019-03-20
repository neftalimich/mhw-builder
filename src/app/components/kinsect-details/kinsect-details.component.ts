import { Component, Input, OnInit } from '@angular/core';
import { StatService } from 'src/app/services/stat.service';
import { ElementType } from 'src/app/types/element.type';
import { KinsectModel } from '../../models/kinsect.model';
import { StatDetailModel } from '../../models/stat-detail.model';

@Component({
	selector: 'mhw-builder-kinsect-details',
	templateUrl: './kinsect-details.component.html',
	styleUrls: ['./kinsect-details.component.scss']
})
export class KinsectDetailsComponent implements OnInit {

	private _kinsect: KinsectModel;

	@Input()
	set kinsect(kinsect: KinsectModel) {
		this._kinsect = kinsect;
		if (kinsect) {
			this.setupStats();
		} else {

		}
	}
	get kinsect(): KinsectModel {
		return this._kinsect;
	}

	stats: StatDetailModel[] = [];

	constructor(private statService: StatService) {
		this.statService.statsUpdated$.subscribe(stats => {
			this.kinsect = stats.kinsect;
			this.setupStats();
		});
	}

	ngOnInit() {
	}

	setupStats() {
		this.stats = [];

		this.stats.push({
			name: 'Attack Type',
			value: this.kinsect.attackType
		});

		this.stats.push({
			name: 'Dust Effect',
			value: this.kinsect.dustEffect
		});

		let power = this.kinsect.power;
		const powerDetail: StatDetailModel = {
			name: 'Power',
			value: 'Lv '
		};
		if (this.kinsect.element != ElementType.None) {
			this.stats.push({
				name: 'Element Damage Type',
				value: this.kinsect.element
			});
			this.stats.push({
				name: 'Element Power',
				value: `Lv ${this.kinsect.elementPower}`
			});
			power -= 1;
			powerDetail.color = 'yellow';
		}
		powerDetail.value += `${power}`;
		this.stats.push(powerDetail);

		this.stats.push({
			name: 'Speed',
			value: `Lv ${this.kinsect.speed}`
		});

		this.stats.push({
			name: 'Heal',
			value: `Lv ${this.kinsect.heal}`
		});
	}
}

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
			if (stats.kinsect) {
				this.kinsect = stats.kinsect;
				this.setupStats();
			}
		});
	}

	ngOnInit() {
	}

	setupStats() {
		this.stats = [];

		this.stats.push({
			icon: 'attack-type',
			name: 'Attack Type',
			value: this.kinsect.attackType
		});

		this.stats.push({
			icon: 'dust-effect',
			name: 'Dust Effect',
			value: this.kinsect.dustEffect,
			class1: this.kinsect.dustEffect
		});

		let power = this.kinsect.power;
		const powerDetail: StatDetailModel = {
			icon: 'kinsect/power',
			name: 'Power',
			value: 'Lv '
		};
		if (this.kinsect.element && this.kinsect.element != ElementType.None) {
			this.stats.push({
				icon: this.kinsect.element.toLowerCase(),
				name: 'Element Power',
				value: `Lv ${this.kinsect.elementPower}`,
				class1: this.kinsect.element
			});
			power -= 1;
			powerDetail.color = 'yellow';
		}
		powerDetail.value += `${power}`;
		this.stats.push(powerDetail);

		this.stats.push({
			icon: '/kinsect/speed',
			name: 'Speed',
			value: `Lv ${this.kinsect.speed}`
		});

		this.stats.push({
			icon: '/kinsect/heal',
			name: 'Heal',
			value: `Lv ${this.kinsect.heal}`
		});
	}
}

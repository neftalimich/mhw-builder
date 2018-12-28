import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { AmmoCapacitiesModel } from '../../models/ammo-capacities.model';
import { DeviationType, RecoilType, ReloadType } from '../../types/deviation.type';

@Component({
	selector: 'mhw-builder-ammo-capacities',
	templateUrl: './ammo-capacities.component.html',
	styleUrls: ['./ammo-capacities.component.scss']
})
export class AmmoCapacitiesComponent implements OnInit {

	@Input() ammoCapacities: AmmoCapacitiesModel;

	recoilSuppresorMod = 0;
	reloadAssistMod = 0;
	deviationSuppresorMod = 0;
	closeRangeUpMod = 0;
	rangeAttackUpMod = 0;
	shieldMod = 0;

	showAmmoModsInfo = false;

	deviationTypes = DeviationType;
	recoilType = RecoilType;
	reloadType = ReloadType;

	constructor() { }

	ngOnInit() {

	}

	allZero(arr: number[]) {
		return _.every(arr, v => !v);
	}

	allZero2(levels) {
		return _.every(levels, v => v.capacity == 0);
	}

	setRecoil(val: number) {
		if (this.recoilSuppresorMod == val) {
			this.recoilSuppresorMod = Math.max(this.recoilSuppresorMod - 1, 0);
		} else {
			this.recoilSuppresorMod = val;
		}
	}
	setReload(val: number) {
		if (this.reloadAssistMod == val) {
			this.reloadAssistMod = Math.max(this.reloadAssistMod - 1, 0);
		} else {
			this.reloadAssistMod = val;
		}
	}
	setDeviation(val: number) {
		if (this.deviationSuppresorMod == val) {
			this.deviationSuppresorMod = Math.max(this.deviationSuppresorMod - 1, 0);
		} else {
			this.deviationSuppresorMod = val;
		}
	}
}

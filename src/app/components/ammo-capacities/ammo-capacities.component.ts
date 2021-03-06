import { Component, Input, OnInit } from '@angular/core';
import { StatService } from 'src/app/services/stat.service';
import { AmmoCapacitiesModel, AmmoLevelModel } from '../../models/ammo-capacities.model';
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

	constructor(private statService: StatService) {
		this.statService.statsUpdated$.subscribe(stats => {
			this.recoilSuppresorMod = 0;
			this.reloadAssistMod = 0;
			this.deviationSuppresorMod = 0;
			this.setRecoil(Math.abs(stats.recoil));
			this.setReload(Math.abs(stats.reload));
			this.setDeviation(Math.abs(stats.deviation));
		});
	}

	ngOnInit() {
	}

	allZero(levels: AmmoLevelModel[]) {
		return levels.every(v => v.capacity == 0);
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

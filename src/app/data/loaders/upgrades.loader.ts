import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpgradeModel } from '../../models/upgrade.model';
import { DataLoader } from './data.loader';

@Injectable()
export class UpgradesLoader extends DataLoader<UpgradeModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AwakeningModel } from '../../models/awakening.model';
import { DataLoader } from './data.loader';

@Injectable()
export class AwakeningsLoader extends DataLoader<AwakeningModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataLoader } from './data.loader';
import { AugmentationModel } from '../../models/augmentation.model';

@Injectable()
export class AugmentationsLoader extends DataLoader<AugmentationModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

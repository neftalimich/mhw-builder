import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AugmentationModel } from '../../models/augmentation.model';
import { DataLoader } from './data.loader';

@Injectable()
export class AugmentationsLoader extends DataLoader<AugmentationModel> {
	constructor(
		protected http: HttpClient
	) {
		super(http);
	}
}

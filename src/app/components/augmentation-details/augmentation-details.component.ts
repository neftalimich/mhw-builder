import { Component, OnInit, Input } from '@angular/core';
import { AugmentationModel } from '../../models/augmentation.model';

@Component({
	selector: 'mhw-builder-augmentation-details',
	templateUrl: './augmentation-details.component.html',
	styleUrls: ['./augmentation-details.component.scss']
})
export class AugmentationDetailsComponent implements OnInit {
	@Input() augmentation: AugmentationModel;

	constructor(
	) { }

	ngOnInit(): void { }
}

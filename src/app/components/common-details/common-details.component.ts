import { Component, OnInit, Input } from '@angular/core';
import { CommonModel } from '../../models/common.model';

@Component({
	selector: 'mhw-builder-common-details',
	templateUrl: './common-details.component.html',
	styleUrls: ['./common-details.component.scss']
})
export class CommonDetailsComponent implements OnInit {
	@Input() common: CommonModel;

	constructor(
	) { }

	ngOnInit(): void { }
}

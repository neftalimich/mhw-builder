import { Component, OnInit, Input } from '@angular/core';
import { ModificationModel } from '../../models/modification.model';

@Component({
	selector: 'mhw-builder-modification-details',
	templateUrl: './modification-details.component.html',
	styleUrls: ['./modification-details.component.scss']
})
export class ModificationDetailsComponent implements OnInit {
	@Input() modification: ModificationModel;

	constructor(
	) { }

	ngOnInit(): void { }
}

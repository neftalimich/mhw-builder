import { Component, Input, OnInit } from '@angular/core';
import { MelodiesModel } from '../../models/melodies.model';

@Component({
	selector: 'mhw-builder-melodies',
	templateUrl: './melodies.component.html',
	styleUrls: ['./melodies.component.scss']
})
export class MelodiesComponent implements OnInit {

	@Input() weaponMelodies: MelodiesModel;

	constructor() { }

	ngOnInit() {

	}
}

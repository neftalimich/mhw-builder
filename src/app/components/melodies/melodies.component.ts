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

	getNoteClass(note: string) {
		if (isNaN(parseInt(note.substring(note.length - 1, note.length), 10))) {
			return note;
		} else {
			return note.substring(0, note.length - 1);
		}
	}
	getNoteSymbol(note: string) {
		if (isNaN(parseInt(note.substring(note.length - 1, note.length), 10))) {
			return '♪';
		} else {
			const val = note.substring(note.length - 1, note.length);
			if (val == '1') {
				return '♪';
			} if (val == '2') {
				return '♫';
			} else if (val == '3') {
				return '𝆺𝅥𝅯';
			} else {
				return '';
			}
		}
	}
}

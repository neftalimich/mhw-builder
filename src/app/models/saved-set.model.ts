import { WeaponType } from '../types/weapon.type';

export class SavedSetModel {
	setName: string;
	weaponType?: WeaponType;
	totalAttack: number;
	affinity: number;
	element?: string;
	elementAttack?: number;
	ailment?: string;
	ailmentAttack?: number;
	defense?: number[];
	resistances?: number[];
	hashString: string;
	confirm: boolean;

	constructor() {
		this.resistances = [null, null, null, null, null];
	}
}

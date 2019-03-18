import { WeaponType } from '../types/weapon.type';

export class SavedSetModel {
	setName: string;
	weaponType?: WeaponType;
	totalAttack: number;
	element?: string;
	elementAttack?: number;
	ailment?: string;
	ailmentAttack?: number;
	hashString: string;
	confirm: boolean;
}

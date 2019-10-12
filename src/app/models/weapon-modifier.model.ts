import { WeaponType } from '../types/weapon.type';

export class WeaponModifierModel {
	type: WeaponType;
	attackModifier: number;
	critElementModifier: number;
	trueCritElementModifier: number;
	critStatusModifier: number;
	trueCritStatusModifier: number;
	nergiganteHunger: number;
}

import { DeviationType } from '../types/deviation.type';
import { SpecialAmmoType } from '../types/special-ammo.type';

export class AmmoCapacitiesModel {
	id: number;
	normal?: number[];
	piercing?: number[];
	spread?: number[];
	sticky?: number[];
	cluster?: number[];
	recover?: number[];
	poison?: number[];
	paralysis?: number[];
	sleep?: number[];
	exhaust?: number[];
	flaming?: number;
	water?: number;
	freeze?: number;
	thunder?: number;
	dragon?: number;
	slicing?: number;
	wyvern?: number;
	demon?: number;
	armor?: number;
	tranq?: number;
	deviation: DeviationType;
	specialAmmo: SpecialAmmoType;
}

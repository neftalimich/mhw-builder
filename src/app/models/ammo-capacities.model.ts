import { DeviationType } from '../types/deviation.type';
import { SpecialAmmoType } from '../types/special-ammo.type';

export class AmmoCapacitiesModel {
	id: number;
	deviation: DeviationType;
	specialAmmo: SpecialAmmoType;
	ammo: any[];
}


import { DeviationType } from '../types/deviation.type';
import { SpecialAmmoType } from '../types/special-ammo.type';

export class AmmoCapacitiesModel {
	id: number;
	deviation: DeviationType[];
	specialAmmo: SpecialAmmoType;
	ammo: AmmoTypeModel[];
	missingMods: boolean;
}

export class AmmoTypeModel {
	name: string;
	levels: AmmoLevelModel[];
}

export class AmmoLevelModel {
	capacity: number;
	type: number;
	recoil: number[];
	reload: number[];
}

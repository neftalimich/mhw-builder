import { AmmoType } from '../types/ammo.type';
import { DeviationType } from '../types/deviation.type';
import { SpecialAmmoType } from '../types/special-ammo.type';

export class AmmoCapacitiesModel {
	id: number;
	deviation: DeviationType[];
	specialAmmo: SpecialAmmoType;
	ammo: AmmoTypeModel[];
	missingData: boolean;
	missingMods: boolean;
}

export class AmmoTypeModel {
	name: AmmoType;
	levels: AmmoLevelModel[];
}

export class AmmoLevelModel {
	capacity: number;
	type: number;
	recoil: number[];
	reload: number[];
}

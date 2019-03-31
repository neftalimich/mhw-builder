import { WeaponType } from '../types/weapon.type';
import { OtherDataModel } from './other-data.model';

export class ExtraDataModel {
	weaponType: WeaponType;
	otherData: OtherDataModel[];
	icon?: string;
}

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SavedSetModel } from '../models/saved-set.model';
import { WeaponType } from '../types/weapon.type';
import { BuildService } from './build.service';
import { StatService } from './stat.service';

@Injectable()
export class SetService {
	sets: SavedSetModel[] = [];
	public setsUpdated$ = new Subject<SavedSetModel[]>();
	selectedSetIndex = -1;

	constructor(
		private location: Location,
		private buildService: BuildService,
		private statService: StatService) {
		this.loadSets();
	}

	loadSets() {
		const stringSets = localStorage.getItem('mhwSets');
		if (stringSets) {
			try {
				this.sets = JSON.parse(stringSets);
			} catch (err) {
				console.log('LocalStorage-Error:', stringSets);
			}
		}
	}

	importSet() {
		const buildParts = location.hash.split('&');
		const buildId = buildParts[0];
		const buildV = buildId.substring(0, 3);
		if (buildId.length > 0) {
			const itemGroupRegex = /(i[.]*[^i]*)/g;
			const itemGroups = buildId.match(itemGroupRegex);
			let itemGroupsLenght = 0;
			if (buildV == '#v3') {
				itemGroupsLenght = 9;
			} else if (buildV == '#v2') {
				itemGroupsLenght = 9;
			} else if (buildId.substring(0, 3) == '#v1') {
				itemGroupsLenght = 8;
			}
			if (itemGroups.length > itemGroupsLenght && itemGroups[itemGroupsLenght].length > 1) {
				const setName = itemGroups[itemGroupsLenght].substring(1, itemGroups[itemGroupsLenght].length);
				itemGroups.splice(-1, 1);
				this.location.replaceState(this.location.path(false), buildV + itemGroups.join(''));
				this.buildService.loadBuild(buildV + itemGroups.join(''));
				this.save(setName + '_IMPORTED', false);
			}
		}
	}

	getSets(): SavedSetModel[] {
		return this.sets;
	}

	save(setName: string, overwrite: boolean = true): number {
		this.loadSets();
		let setItem = this.sets.find(s => s.setName === setName);
		const stats = this.statService.stats;
		if (setItem && overwrite) {
			setItem.hashString = location.hash;
			setItem.hashString = setItem.hashString.replace('#v1', '#v2');
			setItem.weaponType = stats.weaponType;
			setItem.totalAttack = stats.totalAttack;
			setItem.affinity = stats.affinity;
			setItem.element = stats.element;
			setItem.elementAttack = stats.totalElementAttack;
			setItem.ailment = stats.ailment;
			setItem.ailmentAttack = stats.totalAilmentAttack;
			setItem.defense = stats.defense;
			setItem.resistances = [
				stats.fireResist,
				stats.waterResist,
				stats.thunderResist,
				stats.iceResist,
				stats.dragonResist];
			setItem.confirm = false;
			this.selectedSetIndex = this.sets.indexOf(setItem);
		} else {
			setItem = {
				setName: setName,
				hashString: location.hash.replace('#v1', '#v2'),
				weaponType: stats.weaponType,
				totalAttack: stats.totalAttack,
				affinity: stats.affinity,
				element: stats.element,
				elementAttack: stats.totalElementAttack,
				ailment: stats.ailment,
				ailmentAttack: stats.totalAilmentAttack,
				defense: stats.defense,
				resistances: [
					stats.fireResist,
					stats.waterResist,
					stats.thunderResist,
					stats.iceResist,
					stats.dragonResist],
				confirm: false
			};
			this.sets.push(setItem);
			this.selectedSetIndex = this.sets.length - 1;
		}
		localStorage.setItem('mhwSets', JSON.stringify(this.sets));
		this.setsUpdated$.next(this.sets);
		document.title = setName + ' - [MHWBuilder]';
		return this.selectedSetIndex;
	}

	saveSets() {
		localStorage.setItem('mhwSets', JSON.stringify(this.sets));
		this.setsUpdated$.next(this.sets);
	}

	sortSets() {
		this.sets.sort((a, b) => {
			const w1 = this.getWeaponTypeIndex(a.weaponType);
			const w2 = this.getWeaponTypeIndex(b.weaponType);

			if (w1 > w2) {
				return 1;
			}
			if (w1 < w2) {
				return -1;
			}
			if (w1 == w2) {
				return a.setName.localeCompare(b.setName);
			}
		});

		this.setsUpdated$.next(this.sets);
	}

	remove(index: number) {
		if (this.sets[index].confirm) {
			this.sets.splice(index, 1);
			localStorage.setItem('mhwSets', JSON.stringify(this.sets));
		} else {
			this.sets[index].confirm = true;
		}
		this.setsUpdated$.next(this.sets);
	}

	select(set: SavedSetModel): number {
		this.location.replaceState(this.location.path(false), set.hashString);
		this.buildService.loadBuild(location.hash);
		this.selectedSetIndex = this.sets.indexOf(set);
		document.title = set.setName + ' - [MHWBuilder]';
		return this.selectedSetIndex;
	}

	private getWeaponTypeIndex(weaponType?: WeaponType): number {
		if (weaponType == null) {
			return -1;
		}
		if (weaponType == WeaponType.GreatSword) {
			return 0;
		} else if (weaponType == WeaponType.SwordAndShield) {
			return 1;
		} else if (weaponType == WeaponType.DualBlades) {
			return 2;
		} else if (weaponType == WeaponType.LongSword) {
			return 3;
		} else if (weaponType == WeaponType.Hammer) {
			return 4;
		} else if (weaponType == WeaponType.HuntingHorn) {
			return 5;
		} else if (weaponType == WeaponType.Lance) {
			return 6;
		} else if (weaponType == WeaponType.Gunlance) {
			return 7;
		} else if (weaponType == WeaponType.SwitchAxe) {
			return 8;
		} else if (weaponType == WeaponType.ChargeBlade) {
			return 9;
		} else if (weaponType == WeaponType.InsectGlaive) {
			return 10;
		} else if (weaponType == WeaponType.Bow) {
			return 11;
		} else if (weaponType == WeaponType.LightBowgun) {
			return 12;
		} else if (weaponType == WeaponType.HeavyBowgun) {
			return 13;
		} else {
			return -1;
		}
	}
}

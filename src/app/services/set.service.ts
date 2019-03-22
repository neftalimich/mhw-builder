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
		const buildId = location.hash;
		if (buildId.length > 0) {
			const itemGroupRegex = /(i[.]*[^i]*)/g;
			const itemGroups = buildId.match(itemGroupRegex);
			if (itemGroups.length > 7 && itemGroups[7].length > 1) {
				const setName = itemGroups[7].substring(1, itemGroups[7].length);
				itemGroups.splice(-1, 1);
				this.location.replaceState(this.location.path(false), '#v1' + itemGroups.join(''));
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
		if (setItem && overwrite) {
			setItem.hashString = location.hash;
			setItem.weaponType = this.statService.stats.weaponType;
			setItem.totalAttack = this.statService.stats.totalAttack;
			setItem.element = this.statService.stats.element;
			setItem.elementAttack = this.statService.stats.totalElementAttack;
			setItem.ailment = this.statService.stats.ailment;
			setItem.ailmentAttack = this.statService.stats.totalAilmentAttack;
			setItem.confirm = false;
			this.selectedSetIndex = this.sets.indexOf(setItem);
		} else {
			setItem = {
				setName: setName,
				hashString: location.hash,
				weaponType: this.statService.stats.weaponType,
				totalAttack: this.statService.stats.totalAttack,
				element: this.statService.stats.element,
				elementAttack: this.statService.stats.totalElementAttack,
				ailment: this.statService.stats.ailment,
				ailmentAttack: this.statService.stats.totalAilmentAttack,
				confirm: false
			};
			this.sets.push(setItem);
			this.selectedSetIndex = this.sets.length - 1;
		}
		localStorage.setItem('mhwSets', JSON.stringify(this.sets));
		this.setsUpdated$.next(this.sets);
		return this.selectedSetIndex;
	}

	saveSets() {
		localStorage.setItem('mhwSets', JSON.stringify(this.sets));
		this.setsUpdated$.next(this.sets);
	}

	sortSets() {
		this.sets.sort((a, b) => {
			let w1 = 0;
			let w2 = 0;

			switch (a.weaponType) {
				case WeaponType.GreatSword:
					w1 = 1;
					break;
				case WeaponType.SwordAndShield:
					w1 = 2;
					break;
				case WeaponType.DualBlades:
					w1 = 3;
					break;
				case WeaponType.LongSword:
					w1 = 4;
					break;
				case WeaponType.Hammer:
					w1 = 5;
					break;
				case WeaponType.HuntingHorn:
					w1 = 6;
					break;
				case WeaponType.Lance:
					w1 = 7;
					break;
				case WeaponType.Gunlance:
					w1 = 8;
					break;
				case WeaponType.SwitchAxe:
					w1 = 9;
					break;
				case WeaponType.ChargeBlade:
					w1 = 10;
					break;
				case WeaponType.InsectGlaive:
					w1 = 11;
					break;
				case WeaponType.Bow:
					w1 = 12;
					break;
				case WeaponType.LightBowgun:
					w1 = 13;
					break;
				case WeaponType.HeavyBowgun:
					w1 = 14;
					break;
				default:
					w1 = 0;
					break;
			}
			switch (b.weaponType) {
				case WeaponType.GreatSword:
					w2 = 1;
					break;
				case WeaponType.SwordAndShield:
					w2 = 2;
					break;
				case WeaponType.DualBlades:
					w2 = 3;
					break;
				case WeaponType.LongSword:
					w2 = 4;
					break;
				case WeaponType.Hammer:
					w2 = 5;
					break;
				case WeaponType.HuntingHorn:
					w2 = 6;
					break;
				case WeaponType.Lance:
					w2 = 7;
					break;
				case WeaponType.Gunlance:
					w2 = 8;
					break;
				case WeaponType.SwitchAxe:
					w2 = 9;
					break;
				case WeaponType.ChargeBlade:
					w2 = 10;
					break;
				case WeaponType.InsectGlaive:
					w2 = 11;
					break;
				case WeaponType.Bow:
					w2 = 12;
					break;
				case WeaponType.LightBowgun:
					w2 = 13;
					break;
				case WeaponType.HeavyBowgun:
					w2 = 14;
					break;
				default:
					w2 = 0;
					break;
			}

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
		return this.selectedSetIndex;
	}
}

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
			let w1 = this.getWeaponTypeIndex(a.weaponType);
			let w2 = this.getWeaponTypeIndex(b.weaponType);

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

	private getWeaponTypeIndex(weaponType?: WeaponType): number {
		if (weaponType == null) {
			return -1;
		}
		let weaponTypeIndex = -1;
		switch (weaponType) {
			case WeaponType.GreatSword:
				weaponTypeIndex = 0;
				break;
			case WeaponType.SwordAndShield:
				weaponTypeIndex = 1;
				break;
			case WeaponType.DualBlades:
				weaponTypeIndex = 2;
				break;
			case WeaponType.LongSword:
				weaponTypeIndex = 3;
				break;
			case WeaponType.Hammer:
				weaponTypeIndex = 4;
				break;
			case WeaponType.HuntingHorn:
				weaponTypeIndex = 5;
				break;
			case WeaponType.Lance:
				weaponTypeIndex = 6;
				break;
			case WeaponType.Gunlance:
				weaponTypeIndex = 7;
				break;
			case WeaponType.SwitchAxe:
				weaponTypeIndex = 8;
				break;
			case WeaponType.ChargeBlade:
				weaponTypeIndex = 9;
				break;
			case WeaponType.InsectGlaive:
				weaponTypeIndex = 10;
				break;
			case WeaponType.Bow:
				weaponTypeIndex = 11;
				break;
			case WeaponType.LightBowgun:
				weaponTypeIndex = 12;
				break;
			case WeaponType.HeavyBowgun:
				weaponTypeIndex = 13;
				break;
			default:
				weaponTypeIndex = -1;
				break;
		}
		return weaponTypeIndex;
	}
}

import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SavedSetModel } from '../models/saved-set.model';
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
				this.setsUpdated$.next(this.sets);
			} catch (err) {
				console.log('LocalStorage-Error:', stringSets);
			}
		}
	}

	getSets(): SavedSetModel[] {
		return this.sets;
	}

	save(setName: string): number {
		this.loadSets();
		let setItem = this.sets.find(s => s.setName === setName);
		if (setItem) {
			setItem.hashString = location.hash;
			setItem.weaponType = this.statService.stats.weaponType ? this.statService.stats.weaponType.toLowerCase().toLowerCase() : '';
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
				weaponType: this.statService.stats.weaponType ? this.statService.stats.weaponType.toLowerCase().toLowerCase() : '',
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

	remove(index: number) {
		if (this.sets[index].confirm) {
			this.sets.splice(index, 1);
			localStorage.setItem('mhwSets', JSON.stringify(this.sets));
		} else {
			this.sets[index].confirm = true;
		}
	}

	select(set: SavedSetModel): number {
		this.location.replaceState(this.location.path(false), set.hashString);
		this.buildService.loadBuild(location.hash);
		this.selectedSetIndex = this.sets.indexOf(set);
		return this.selectedSetIndex;
	}
}

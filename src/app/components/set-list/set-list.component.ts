import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';
import { BuildService } from 'src/app/services/build.service';
import { StatService } from 'src/app/services/stat.service';

@Component({
	selector: 'mhw-builder-set-list',
	templateUrl: './set-list.component.html',
	styleUrls: ['./set-list.component.scss']
})
export class SetListComponent implements OnInit {

	savedSets: SavedSetModel[] = [];
	virtualItems: SavedSetModel[];
	selectedSetIndex = -1;
	loading = 0;

	@ViewChild('saveBox') saveBox: ElementRef;

	eventOptions: SortablejsOptions = {};

	constructor(private location: Location, private buildService: BuildService, private statService: StatService) {
		this.eventOptions = {
			onUpdate: (event) => {
				if (this.selectedSetIndex == event.oldIndex) {
					this.selectedSetIndex = event.newIndex;
				}
			}
		};
	}

	ngOnInit() {
		this.loadSets();
	}

	loadSets() {
		const stringSets = localStorage.getItem('mhwSets');
		if (stringSets) {
			try {
				this.savedSets = JSON.parse(stringSets);
			} catch (err) {
				console.log('LocalStorage-Error:', stringSets);
			}
		}
	}

	save(setName: string) {
		if (setName) {
			this.loading = 1;
			this.loadSets();
			let setItem = this.savedSets.find(s => s.setName === setName);
			if (setItem) {
				setItem.hashString = location.hash;
				setItem.weaponType = this.statService.stats.weaponType.toLowerCase();
				setItem.totalAttack = this.statService.stats.totalAttack;
				setItem.element = this.statService.stats.element;
				setItem.elementAttack = this.statService.stats.totalElementAttack;
				setItem.ailment = this.statService.stats.ailment;
				setItem.ailmentAttack = this.statService.stats.totalAilmentAttack;
				setItem.confirm = false;
				this.selectedSetIndex = this.savedSets.indexOf(setItem);
			} else {
				setItem = {
					setName: setName,
					hashString: location.hash,
					weaponType: this.statService.stats.weaponType.toLowerCase(),
					totalAttack: this.statService.stats.totalAttack,
					element: this.statService.stats.element,
					elementAttack: this.statService.stats.totalElementAttack,
					ailment: this.statService.stats.ailment,
					ailmentAttack: this.statService.stats.totalAilmentAttack,
					confirm: false
				};
				this.savedSets.push(setItem);
				this.selectedSetIndex = this.savedSets.length - 1;
			}
			localStorage.setItem('mhwSets', JSON.stringify(this.savedSets));
			setTimeout(() => {
				this.loading = 0;
			}, 500);
		}
	}

	saveSets() {
		this.loading = 2;
		localStorage.setItem('mhwSets', JSON.stringify(this.savedSets));
		setTimeout(() => {
			this.loading = 0;
		}, 500);
	}

	remove(index: number) {
		if (this.savedSets[index].confirm) {
			this.savedSets.splice(index, 1);
			localStorage.setItem('mhwSets', JSON.stringify(this.savedSets));
		} else {
			this.savedSets[index].confirm = true;
		}
	}

	select(set: SavedSetModel) {
		this.location.replaceState(this.location.path(false), set.hashString);
		this.buildService.loadBuild(location.hash);
		this.saveBox.nativeElement.value = set.setName;
		this.selectedSetIndex = this.savedSets.indexOf(set);
	}

	downloadFile() {
		const fileName = 'mhw-builder.txt';
		let fileString = '';
		for (const item of this.savedSets) {
			fileString += `-${item.setName}: https://neftalimich.github.io/mhw-builder-page/` + `${item.hashString}` + '\n';
		}
		fileString = fileString.replace(/\n/g, '\r\n');
		console.log(fileString);
		const blob = new Blob([fileString], { type: 'text/txt' });
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, fileName);
		} else {
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
}

class SavedSetModel {
	setName: string;
	weaponType: string;
	totalAttack: number;
	element?: string;
	elementAttack?: number;
	ailment?: string;
	ailmentAttack?: number;
	hashString: string;
	confirm: boolean;
}

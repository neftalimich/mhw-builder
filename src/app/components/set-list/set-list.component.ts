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
		const dateNow = new Date().toLocaleDateString('en-GB', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
		const fileName = `mhw-builder-save(${dateNow}).html`;
		let fileString = '<html><head>'
			+ `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`
			+ '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">';
		fileString += `<style>
				.Fire {
					color: #ff6666;
				}
				.Water {
					color: #66ccff;
				}
				.Thunder {
					color: #ff9900;
				}
				.Ice {
					color: #0099ff;
				}
				.Dragon {
					color: #3cb05d;
				}
				.Poison {
					color: #cc44ff;
				}
				.Sleep {
					color: #9999ff;
				}
				.Paralysis {
					color: #e6cb00;
				}
				.Blast {
					color: #E6A400;
				}
				.weapon-img {
					height: 20px;
				}
			</style>`
			+ '</head><body>'
			+ '<div class="container-fluid"><div class="row"><div class="col-md-4 col-12">'
			+ '<h2>MHW-Builder</h2>'
			+ '<ul class="list-group">';
		for (const item of this.savedSets) {
			fileString += `<li class="list-group-item">`
				// + `<img src="https://neftalimich.github.io/mhw-builder-page/assets/images/weapons/${item.weaponType}-icon.png" class="weapon-img" />`
				+ `<a href="https://neftalimich.github.io/mhw-builder-page?${item.hashString}" class="text-decoration-none">`
				+ `${item.setName}`
				+ `</a> `
				+ ` - <span class="text-capitalize">${item.weaponType} </span>`
				+ `<span class="float-right">`
				+ `<span>${item.totalAttack}</span>`;
			if (item.element || item.ailment) {
				fileString +=
					` (<span class="${item.element}" title="${item.element}">${item.element ? item.elementAttack : ''}</span>`
					+ `${item.ailment && item.element ? '/' : ''}`
					+ `<span class="${item.ailment}" title="${item.ailment}">${item.ailment ? item.ailmentAttack : ''}</span>)`
					+ `</span>`;
			}
			fileString += `</li>`;
		}
		fileString += '</ul>'
			+ '<span class="text-muted float-right" style="font-size:11px">By Neftalí Michelet (neftalimich)</span>'
			+ '</div></div></div>'
			+ '</body></html>';
		const blob = new Blob([fileString], { type: 'text/html' });
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

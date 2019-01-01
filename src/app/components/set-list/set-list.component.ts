import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { BuildService } from 'src/app/services/build.service';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

@Component({
	selector: 'mhw-builder-set-list',
	templateUrl: './set-list.component.html',
	styleUrls: ['./set-list.component.scss']
})
export class SetListComponent implements OnInit {

	savedSets: SavedSetModel[] = [];
	virtualItems: SavedSetModel[];
	private selectedSetIndex: number = -1;

	@ViewChild('saveBox') saveBox: ElementRef;
	@ViewChild('itemList') itemList: VirtualScrollerComponent;


	constructor(private location: Location, private buildService: BuildService) { }

	ngOnInit() {
		let stringSets = localStorage.getItem('mhwSets');
		if (stringSets) {
			try {
				this.savedSets = JSON.parse(stringSets);
				// console.log("localStorage", this.savedSets);
			} catch (err) {
				// console.log("Error", stringSets);
				// localStorage.setItem('mhwSets', '');
			}
		}
	}

	onItemListUpdate(items: SavedSetModel[]) {
		this.virtualItems = items;
	}

	save(setName: string) {
		console.log(setName);
		if (setName) {
			let setItem = this.savedSets.find(s => s.setName === setName);
			if (setItem) {
				setItem.hashString = location.hash;
				this.selectedSetIndex = this.savedSets.indexOf(setItem);
			} else {
				setItem = {
					setName: setName,
					hashString: location.hash,
					confirm: false
				};
				this.savedSets.push(setItem);
				this.selectedSetIndex = this.savedSets.length - 1;
			}
			localStorage.setItem('mhwSets', JSON.stringify(this.savedSets));
		}
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
		this.saveBox.nativeElement.value = set.setName
		this.selectedSetIndex = this.savedSets.indexOf(set);
	}

	downloadFile() {
		let fileName = 'mhw-builder.txt';
		let fileString = '';
		for (let item of this.savedSets) {
			fileString += `-${item.setName}: ${window.location.origin}/?${item.hashString}` + '\n';
		}
		fileString = fileString.replace(/\n/g, "\r\n");
		console.log(fileString);
		const blob = new Blob([fileString], { type: 'text/txt' });
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, fileName);
		} else {
			var a = document.createElement('a');
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
	hashString: string;
	confirm: boolean;
}

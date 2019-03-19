import { NgModule } from '@angular/core';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
	declarations: [
		DropdownComponent,
		ModalComponent
	],
	exports: [
		DropdownComponent,
		ModalComponent
	]
})
export class CommonModule { }

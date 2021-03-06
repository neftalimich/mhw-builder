import { ItemType } from '../types/item.type';

export class SlotModel {
	level: number;
	augmentation?: boolean;
	slotsAdded?: SlotLevelAddedModel[];
}

export class SlotLevelAddedModel {
	itemType: ItemType;
	level: number;
}

export class BuildModel {
	weapon: BuildItemModel;
	head: BuildItemModel;
	chest: BuildItemModel;
	hands: BuildItemModel;
	legs: BuildItemModel;
	feet: BuildItemModel;
	charm: BuildItemModel;
}

export class BuildItemModel {
	itemId: number;
	kinsectId?: number;
	kinsectElementId?: number;
	decorationIds?: number[];
	augmentationIds?: number[];
	level?: number;
	modificationIds: number[];
}

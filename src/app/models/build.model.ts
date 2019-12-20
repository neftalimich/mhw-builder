export class BuildModel {
	weapon: BuildItemModel;
	head: BuildItemModel;
	chest: BuildItemModel;
	hands: BuildItemModel;
	legs: BuildItemModel;
	feet: BuildItemModel;
	charm: BuildItemModel;
	tool1: BuildItemModel;
	tool2: BuildItemModel;
}

export class BuildItemModel {
	itemId: number;
	kinsectId?: number;
	kinsectElementId?: number;
	decorationIds?: number[];
	augmentationIds?: number[];
	upgradeLevels?: number[];
	customLevelIds?: number[];
	awakenings?: number[][];
	setbonusId?: number;
	level?: number;
	modificationIds: number[];

	elementId?: number;
	ailmentId?: number;
}

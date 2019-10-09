import { Component, Input, OnInit } from '@angular/core';
import { SkillModel } from '../../models/skill.model';
import { StatDetailModel } from '../../models/stat-detail.model';
import { UpgradeContainerModel } from '../../models/upgrade-container.model';
import { DataService } from '../../services/data.service';
import { TooltipService } from '../../services/tooltip.service';
import { AugmentationType } from '../../types/augmentation.type';

@Component({
	selector: 'mhw-builder-upgrade-details',
	templateUrl: './upgrade-details.component.html',
	styleUrls: ['./upgrade-details.component.scss']
})
export class UpgradeDetailsComponent implements OnInit {
	private _upgradeContainer: UpgradeContainerModel;

	@Input()
	set upgradeContainer(upgrade: UpgradeContainerModel) {
		this._upgradeContainer = upgrade;
		if (upgrade) {
			this.setupStats();
			this.loadSkills();
		} else {
			this.skills = new Array<SkillModel>();
		}
	}
	get upgradeContainer(): UpgradeContainerModel {
		return this._upgradeContainer;
	}

	skills: SkillModel[];
	stats: StatDetailModel[] = [];

	constructor(
		private dataService: DataService,
		private tooltipService: TooltipService
	) {
	}

	ngOnInit() { }

	setupStats() {
		this.stats = [];
		for (const detail of this.upgradeContainer.upgradeDetails) {
			if (detail.level > 0) {
				this.stats.push({ name: detail.type, value: detail.description });
			}
		}

		const countAttack = this.upgradeContainer.customUpgrades.filter(custom => custom == 'Attack').length;
		const countAffinity = this.upgradeContainer.customUpgrades.filter(custom => custom == 'Affinity').length;
		const countElement = this.upgradeContainer.customUpgrades.filter(custom => custom == 'Element').length;

		if (countAttack > 0) {
			this.stats.push({ name: 'Attack Custom', value: `+${countAttack}` });
		}
		if (countAffinity > 0) {
			this.stats.push({ name: 'Affinity Custom', value: `+${countAffinity}` });
		}
		if (countElement > 0) {
			this.stats.push({ name: 'Element/Ailment Custom', value: `+${countElement * 10}` });
		}
	}


	loadSkills() {
		//this.skills = this.dataService.getSkills(this.upgrade.skills);
	}

	clearTooltipUpgrade() {
		this.tooltipService.setUpgradeContainer(null);
	}
}

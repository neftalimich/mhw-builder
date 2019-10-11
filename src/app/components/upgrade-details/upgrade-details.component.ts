import { Component, Input, OnInit } from '@angular/core';
import { StatDetailModel } from '../../models/stat-detail.model';
import { UpgradeContainerModel } from '../../models/upgrade-container.model';
import { TooltipService } from '../../services/tooltip.service';

@Component({
	selector: 'mhw-builder-upgrade-details',
	templateUrl: './upgrade-details.component.html',
	styleUrls: ['./upgrade-details.component.scss']
})
export class UpgradeDetailsComponent implements OnInit {
	private _upgradeContainer: UpgradeContainerModel;

	@Input()
	set upgradeContainer(upgradeContainer: UpgradeContainerModel) {
		this._upgradeContainer = upgradeContainer;
		if (upgradeContainer) {
			this.setupStats();
		}
	}
	get upgradeContainer(): UpgradeContainerModel {
		return this._upgradeContainer;
	}

	stats: StatDetailModel[] = [];

	constructor(private tooltipService: TooltipService) {
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
		const countDefense = this.upgradeContainer.customUpgrades.filter(custom => custom == 'Defense').length;

		if (countAttack > 0) {
			this.stats.push({ name: 'Custom Attack', value: `+${countAttack}` });
		}
		if (countAffinity > 0) {
			this.stats.push({ name: 'Custom Affinity', value: `+${countAffinity}` });
		}
		if (countElement > 0) {
			this.stats.push({ name: 'Custom Element/Ailment', value: `+${countElement * 10}` });
		}
		if (countDefense > 0) {
			this.stats.push({ name: 'Custom Defense', value: `+${countDefense * 15}` });
		}
	}

	clearTooltipUpgrade() {
		this.tooltipService.setUpgradeContainer(null);
	}
}

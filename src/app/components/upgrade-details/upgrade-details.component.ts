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

		let upgradePassiveAttack = 0;
		let upgradePassiveAffinity = 0;
		let upgradePassiveAilmentElement = 0;
		let upgradePassiveDefense = 0;

		for (const [i, customId] of this.upgradeContainer.customUpgradeIds.entries()) {
			switch (customId) {
				case 1: // Attack
					upgradePassiveAttack += this.upgradeContainer.customUpgradeValues[i];
					break;
				case 2: // Affinity
					upgradePassiveAffinity += this.upgradeContainer.customUpgradeValues[i];
					break;
				case 3: // Defense
					upgradePassiveDefense += this.upgradeContainer.customUpgradeValues[i];
					break;
				case 6: // Element / Ailment
					upgradePassiveAilmentElement += this.upgradeContainer.customUpgradeValues[i] * 10;
					break;
				default:
					break;
			}
		}


		if (upgradePassiveAttack > 0) {
			this.stats.push({ name: 'Custom Attack', value: `+${upgradePassiveAttack}` });
		}
		if (upgradePassiveAffinity > 0) {
			this.stats.push({ name: 'Custom Affinity', value: `+${upgradePassiveAffinity}` });
		}
		if (upgradePassiveDefense > 0) {
			this.stats.push({ name: 'Custom Defense', value: `+${upgradePassiveDefense}` });
		}
		if (upgradePassiveAilmentElement > 0) {
			this.stats.push({ name: 'Custom Element/Ailment', value: `+${upgradePassiveAilmentElement}` });
		}
	}

	clearTooltipUpgrade() {
		this.tooltipService.setUpgradeContainer(null);
	}
}

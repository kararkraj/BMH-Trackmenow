import { Component } from '@angular/core';

import { AssetService } from './../../services/asset/asset.service';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

    public filterText;

    constructor(
        private assetService: AssetService
    ) {}

    filterAssets() {
        if (this.filterText) {
            this.assetService.filterAssets(this.filterText);
        } else {
            this.assetService.setAllAssetsVisible();
            this.assetService.resetFilterString();
        }
    }

}

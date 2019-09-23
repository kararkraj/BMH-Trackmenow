import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AssetService } from './../../services/asset/asset.service';
import { Asset } from './../../services/asset/asset';
import { LoaderService } from './../../services/loader/loader.service';

declare var google;

@Component({
    selector: 'app-asset-list',
    templateUrl: './asset-list.page.html',
    styleUrls: ['./asset-list.page.scss'],
})
export class AssetListPage {

    public assets: Asset[];

    constructor(
        private assetService: AssetService,
        private router: Router,
        private loader: LoaderService
    ) { }

    ngOnInit() {
        this.loader.startLoading().then(() => {
            this.assetService.getAssets().then(() =>{
                this.assetService.updateAssets();
                this.loader.stopLoading();
            });
        });
    }

    trackAssets() {
        this.router.navigate(['tabs/tabs/asset-map']);
    }

    trackAsset(assetNumber) {
        this.router.navigate(['tabs/tabs/asset-map']);
    }

    deselectAssets() {
        this.assetService.deselectAssets();
    }

    navigateTo(page) {
        this.router.navigate([page]);
    }

    getBalanceFuelPercent(balanceFuel, tankCapacity) {
        return Math.round(balanceFuel * 100 / tankCapacity) + '%';
    }

    toggleSelectedAssets(assetNumber) {
        if (this.assetService.selectedAssets.includes(assetNumber)) {
            this.assetService.selectedAssets.splice(this.assetService.selectedAssets.indexOf(assetNumber), 1);
        } else {
            this.assetService.selectedAssets.push(assetNumber);
        }
    }

}

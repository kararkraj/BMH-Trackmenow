import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AssetService } from './../../services/asset/asset.service';
import { HttpService } from './../../services/http/http.service';
import { Asset } from './../../services/asset/asset';

declare var google;

@Component({
    selector: 'app-asset-list',
    templateUrl: './asset-list.page.html',
    styleUrls: ['./asset-list.page.scss'],
})
export class AssetListPage {

    public multipleSelection: boolean = false;

    constructor(
        public assetService: AssetService,
        private http: HttpService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.http.startLoading().then(() => {
            this.assetService.getAssets().then(() => {
                this.assetService.updateAssets();
                this.http.stopLoading();
            });
        });
        this.activatedRoute.params.subscribe(() => {
            this.assetService.setMultipleSelection();
        });
    }

    trackAssets() {
        this.router.navigate(['/tabs/asset-map'], { queryParams: { assetNumber: 'multipleAssets' }, skipLocationChange: true });
    }

    trackAsset(assetNumber) {
        this.assetService.deselectAsset(assetNumber);
        this.router.navigate(['/tabs/asset-map'], { queryParams: { assetNumber: assetNumber }, skipLocationChange: true });
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
        this.assetService.toggleSelectedAssets(assetNumber);
        this.assetService.setMultipleSelection();
    }

    stopTrackingAssets() {
        this.assetService.stopTrackingAssets();
        this.assetService.setMultipleSelection();
    }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

    constructor(
        public assetService: AssetService,
        private http: HttpService,
        private router: Router
    ) { }

    ngOnInit() {
        this.http.startLoading().then(() => {
            this.assetService.getAssets().then(() =>{
                this.assetService.updateAssets();
                this.http.stopLoading();
            });
        });
    }

    trackAssets() {
        // this.router.navigate(['tabs/tabs/asset-map', {assetNumber: 'multipleAssets'}]);
        this.router.navigate(['/tabs/asset-map'], { queryParams: {assetNumber: 'multipleAssets'}, skipLocationChange: true });
    }

    trackAsset(assetNumber) {
        // this.router.navigate(['tabs/tabs/asset-map', {assetNumber: assetNumber}]);
        this.router.navigate(['/tabs/asset-map'], {  queryParams: {assetNumber: assetNumber}, skipLocationChange: true });
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

import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { PresenterDetailPage } from '../presenter-detail/presenter-detail';
import { DataProvider } from '../../providers/data-provider';

@Component({
    selector: 'page-presenter-list',
    templateUrl: 'presenter-list.html'
})
export class PresenterListPage {

    presenters: any;

    constructor(public navCtrl: NavController, public dataProvider: DataProvider) { }

    ionViewDidLoad() {
        this.dataProvider.getSpeakers().then(data => {
            this.presenters = data;
        });
    }

    clickOnPresenter(presenter) {
        this.navCtrl.push(PresenterDetailPage, {
            presenter: presenter
        });
    }

}

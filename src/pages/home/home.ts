import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { PresenterListPage } from '../presenter-list/presenter-list';
import { SessionListPage } from '../session-list/session-list';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    pages = { 'presenter-list': PresenterListPage, 'session': SessionListPage };

    constructor(public navCtrl: NavController) { }

    openPage(page) {
        this.navCtrl.push(this.pages[page]);
    }

}

import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen} from 'ionic-native';
import { NavController, MenuController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { PresenterListPage } from '../pages/presenter-list/presenter-list';
import { SessionListPage } from '../pages/session-list/session-list';
import { AboutPage } from '../pages/about/about';
import { SqlSettingsService } from '../providers/sql-setting-service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage = HomePage;
    @ViewChild('content') nav: NavController;

    pages = { 'presenter-list': PresenterListPage, 'session': SessionListPage, 'about': AboutPage };

    constructor(platform: Platform, public menuCtrl: MenuController, sqlSettingsService:SqlSettingsService ) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            let db = sqlSettingsService.db;
            sqlSettingsService.openDb().then(() => {
                db.executeSql("CREATE TABLE IF NOT EXISTS NOTES (id integer primary key, comment text, sessionId text)", {}).then((data) => {
                    console.log("TABLE CREATED: ", data);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
                db.executeSql("CREATE TABLE IF NOT EXISTS FAV_SESSIONS (id integer primary key AUTOINCREMENT, sessionId text)", {}).then((data) => {
                    console.log("TABLE CREATED: ", data);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
                db.executeSql("CREATE TABLE IF NOT EXISTS MEDIAS (id integer primary key AUTOINCREMENT, sessionId text, image text, urlMedia text, mediaType text, name text, isPicture integer, isVideo integer)", {}).then((data) => {
                    console.log("TABLE CREATED: ", data);
                }, (error) => {
                    console.error("Unable to execute sql", error);
                })
            }, (error) => {
                console.error("Unable to open database", error);
            });

        });

    }

    openPage(page) {
        this.menuCtrl.close();
        this.nav.push(this.pages[page]);
    }
}

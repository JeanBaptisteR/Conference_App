import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data-provider';
import { PresenterDetailPage } from '../presenter-detail/presenter-detail';
import { NotesPage } from '../notes/notes';

@Component({
    selector: 'page-session-detail',
    templateUrl: 'session-detail.html'
})
export class SessionDetailPage {

    session: any;
    sessionHours: any;
    speakers = [];

    constructor(public navCtrl: NavController, public params: NavParams, public dataProvider: DataProvider) {
        this.session = params.get("session");

        if(this.session.speakers !== undefined) {
          this.session.speakers.forEach(speakerId =>
              this.dataProvider.getPresentersById(speakerId).then(speaker => {
                  this.speakers.push(speaker);
              }));
        }
    }

    goToSpeakerDetail(speaker) {
        this.navCtrl.push(PresenterDetailPage, {
            presenter: speaker
        });
    }

    clickOnNotes(session) {
        this.navCtrl.push(NotesPage, {
            session: session
        });
    }

}

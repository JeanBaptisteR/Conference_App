import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';
import { SessionDetailPage } from '../session-detail/session-detail';
import { DataProvider } from '../../providers/data-provider';
import { ActionSheet } from "ionic-native";
import { FavSessionsService } from '../../providers/fav-sessions-service';

@Component({
    selector: 'page-session-list',
    templateUrl: 'session-list.html'
})
export class SessionListPage {

    sessions: any;
    allSessions: any;
    favorites = [];
    groups = [];
    segment = 'all';

    constructor(public navCtrl: NavController, public toastCtrl: ToastController, public dataProvider: DataProvider, public favService: FavSessionsService) {
        this.dataProvider.getSessions().then(data => {
            this.allSessions = data;
            this.sessions = data;
            this.sortListByHours(this.sessions);
            this.groups = this.groupBy(this.sessions, function(item) {
                return [item.sessionHours];
            });
        });
        this.load();
    }

    sortListByHours(list) {
      list.sort(function(a, b) {
          var firstHour = parseInt(a.sessionStart);
          var secondHour = parseInt(b.sessionStart);
          if (firstHour < secondHour)
              return -1;
          if (firstHour > secondHour)
              return 1;
          return 0;
      });
    }

    load() {
      this.favService.getFavorites().then((data) => {
        if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
                this.favorites.push(this.allSessions.find(session => session.id == data.rows.item(i).sessionId));
            }
            this.sortListByHours(this.favorites);
        }
      }, (error) => {
          console.log("ERROR: " + JSON.stringify(error.message));
      });
    }

    displayToast(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        })
        toast.present(toast);
    }

    groupBy(array, f) {
        var groups = {};
        array.forEach(function(o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function(group) {
            return groups[group];
        })
    }

    updateTab() {
        if (this.segment === "all") {
            this.sessions = this.allSessions;
        } else {
            this.sessions = this.favorites;
        }
    }

    clickOnSession(session) {
        this.navCtrl.push(SessionDetailPage, {
            session: session
        });
    }

    addToFavorite(session) {
        let buttonLabels = ['Oui', 'Non'];
        ActionSheet.show({
            'title': 'Voulez vous ajouter cette session à votre parcours ?',
            'buttonLabels': buttonLabels,
            addCancelButtonWithLabel: 'Annuler'
        }).then((buttonIndex: number) => {
            if (buttonIndex == 1) {
                var i = this.favorites.indexOf(session);
                if (i != -1) {
                    this.displayToast("Cette session fait déjà partie de votre parcours personnalisé", 2000);
                } else {
                    this.favorites.push(session);
                    this.sortListByHours(this.favorites);
                    this.favService.saveFavorite(session.id).then((data) => {
                        console.log("INSERTED: " + JSON.stringify(data));
                    }, (error) => {
                        console.log("ERROR: " + JSON.stringify(error.err));
                    });
                }
            }
        });
    }

    removeFavorite(session) {
        let buttonLabels = ['Oui', 'Non'];
        ActionSheet.show({
            'title': 'Voulez vous supprimer cette session de votre parcours ?',
            'buttonLabels': buttonLabels,
            addCancelButtonWithLabel: 'Annuler'
        }).then((buttonIndex: number) => {
            if (buttonIndex == 1) {
                var i = this.favorites.indexOf(session);
                if (i != -1) {
                    this.favorites.splice(i, 1);
                }
                this.favService.deleteFavorite(session.id).then((data) => {
                    console.log("DELETED: " + JSON.stringify(data));
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
            }
        });
    }

}

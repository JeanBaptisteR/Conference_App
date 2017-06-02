import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class DataProvider {
    data: any;

    constructor(private http: Http) {
        this.data = null;
    }

    load() {
        if (this.data) {
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {
            this.http.get('assets/data/devfest-2015.json')
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data);
                });
        });
    }

    getSpeakers() {
        return this.load().then(data => {
            data['speakers'].forEach(speaker =>
                speaker.urlImage = "assets/data/images/" + speaker.image
            )
            return data['speakers']
        });
    }

    getSessions(): Promise<any> {
        return this.load().then(data => {
            var promises = [];
            data['sessions'].forEach(session => {
                promises.push(this.getHourById(session.hour).then(hour => {
                    session.sessionHours = hour;
                    session.sessionStart = hour['hourStart'] + hour['minStart'];
                }));
            })
            return Promise.all(promises).then(() => {
                return data['sessions']
            })
        });
    }

    getHours() {
        return this.load().then(data => {
            return data['hours'];
        });
    }

    getHourById(hourId) {
        return this.getHours()
            .then(hours => {
                var result = [];
                Object.keys(hours).forEach(function(id) {
                    if (id == hourId) {
                        result = hours[id];
                    }
                })
                return result
            });
    }

    getPresentersById(sessionId) {
        return this.getSpeakers()
            .then(speakers => speakers.find(speaker => speaker.id == sessionId));
    }

    getSessionsBySpeakerId(speakerId) {
        return this.getSessions()
            .then(sessions => sessions.filter(session => session.speakers !== undefined).filter(session => session.speakers.indexOf(speakerId) !== -1));
    }

}

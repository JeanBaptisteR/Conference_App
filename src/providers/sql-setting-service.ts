import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class SqlSettingsService {

    db: SQLite;

    constructor() {
        this.db = new SQLite();
    }

    openDb(){
        return this.db.openDatabase({
             name: 'data.db',
             location: 'default'
        });
    }

}

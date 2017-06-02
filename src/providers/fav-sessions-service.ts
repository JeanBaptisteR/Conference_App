import { Injectable } from '@angular/core';
import { SqlSettingsService } from './sql-setting-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class FavSessionsService {

    constructor(public sqlSettingsService:SqlSettingsService) {}

    getFavorites() {
        return this.sqlSettingsService.db.executeSql("SELECT * FROM FAV_SESSIONS", []);
    }

    saveFavorite(sessionId) {
        return this.sqlSettingsService.db.executeSql("INSERT INTO FAV_SESSIONS (sessionId) VALUES (?)", [sessionId]);
    }

    deleteFavorite(sessionId) {
        return this.sqlSettingsService.db.executeSql("DELETE FROM FAV_SESSIONS WHERE sessionId = ?", [sessionId]);
    }

}

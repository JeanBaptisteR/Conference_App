import { Injectable } from '@angular/core';
import { SqlSettingsService } from './sql-setting-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class NotesService {

    constructor(public sqlSettingsService:SqlSettingsService) {}

    getNotesFromSessionId(sessionId) {
        return this.sqlSettingsService.db.executeSql("SELECT * FROM NOTES WHERE sessionId = (?) ", [sessionId]);
    }

    getMediaFromSessionId(sessionId) {
        return this.sqlSettingsService.db.executeSql("SELECT * FROM MEDIAS WHERE sessionId = (?) ", [sessionId]);
    }

    savePicture(picture, sessionId) {
        return this.sqlSettingsService.db.executeSql("INSERT INTO MEDIAS (image, sessionId, isPicture) VALUES (?, ?, ?)", [picture, sessionId, 1]);
    }

    saveAudio(name, fullPath, type, sessionId) {
        return this.sqlSettingsService.db.executeSql("INSERT INTO MEDIAS (name, urlMedia, mediaType, sessionId, isPicture, isVideo) VALUES (?, ?, ?, ?, ?, ?)", [name, fullPath, type, sessionId, 0, 0]);
    }

    saveVideo(name, fullPath, type, sessionId) {
        return this.sqlSettingsService.db.executeSql("INSERT INTO MEDIAS (name, urlMedia, mediaType, sessionId, isPicture, isVideo) VALUES (?, ?, ?, ?, ?, ?)", [name, fullPath, type, sessionId, 0, 1]);
    }

    deletePicture(picture) {
        return this.sqlSettingsService.db.executeSql("DELETE FROM MEDIAS WHERE image = ?", [picture]);
    }

    addNote(notes, sessionId) {
        return this.sqlSettingsService.db.executeSql("INSERT INTO NOTES (comment, sessionId) VALUES (?, ?)", [notes, sessionId]);
    }

    updateNote(notesId, notes) {
        return this.sqlSettingsService.db.executeSql("UPDATE NOTES SET comment = ? WHERE id = ?", [notes, notesId])
    }
}

import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { NotesPage } from '../pages/notes/notes';
import { PresenterListPage } from '../pages/presenter-list/presenter-list';
import { PresenterDetailPage } from '../pages/presenter-detail/presenter-detail';
import { SessionListPage } from '../pages/session-list/session-list';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { HomePage } from '../pages/home/home';
import { DataProvider } from '../providers/data-provider';
import { NotesService } from '../providers/notes-service';
import { FavSessionsService } from '../providers/fav-sessions-service';
import { SqlSettingsService } from '../providers/sql-setting-service';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    NotesPage,
    PresenterListPage,
    PresenterDetailPage,
    SessionListPage,
    SessionDetailPage,
    HomePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    NotesPage,
    PresenterListPage,
    PresenterDetailPage,
    SessionListPage,
    SessionDetailPage,
    HomePage
  ],
  providers: [SqlSettingsService, FavSessionsService, NotesService, DataProvider, {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}

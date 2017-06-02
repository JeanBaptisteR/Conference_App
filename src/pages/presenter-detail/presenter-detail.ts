import { Component } from '@angular/core';
import { DataProvider } from '../../providers/data-provider';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SessionDetailPage } from '../session-detail/session-detail';
import { InAppBrowser, Contacts, ContactName, ContactField, ContactOrganization } from 'ionic-native';

@Component({
    selector: 'page-presenter-detail',
    templateUrl: 'presenter-detail.html'
})
export class PresenterDetailPage {

    presenter: any;
    sessions: any;
    isContact: boolean;

    constructor(public navCtrl: NavController, public params: NavParams, public dataProvider: DataProvider, public toastCtrl: ToastController) {
        this.presenter = params.get("presenter");
        this.dataProvider.getSessionsBySpeakerId(this.presenter.id).then(session => {
            this.sessions = session;
        });

        Contacts.find(["nickname"], { filter: this.presenter.id }).then((contacts) => {
            if (contacts.length > 0) {
                this.isContact = true;
            }
        })
    }

    displayToast(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        })
        toast.present(toast);
    }

    goToSessionDetail(session) {
        this.navCtrl.push(SessionDetailPage, {
            session: session
        });
    }

    goToSocialLink(link) {
        new InAppBrowser(link, '_blank');
    }

    changeContactEvent() {
        if (this.isContact) {
            Contacts.find(["nickname"], { filter: this.presenter.id }).then((contacts) => {
                if (contacts.length == 0) {
                    this.addContact();
                }
            })
        } else {
            Contacts.find(["nickname"], { filter: this.presenter.id }).then((contact) => {
                if (contact.length > 0) {
                    contact[0].remove().then(() => {
                      this.displayToast("Contact supprimé", 2000);
                    }, (error) => {
                        console.error(error);
                    })
                }
            })
        }
    }

    addContact() {
        var contact = Contacts.create();
        contact.displayName = this.presenter.lastname + " " + this.presenter.firstname;
        contact.nickname = this.presenter.id;

        var name = new ContactName();
        name.givenName = this.presenter.firstname;
        name.familyName = this.presenter.lastname;
        contact.name = name;

        var urls = [];
        this.presenter.socials.forEach(social => {
            var url = new ContactField();
            url.type = social.class;
            url.value = social.link;
            urls.push(url);
        });
        contact.urls = urls;

        var contactOrganisations = [];
        var contactOrganisation = new ContactOrganization();
        contactOrganisation.name = this.presenter.company;
        contactOrganisations.push(contactOrganisation);
        contact.organizations = contactOrganisations;

        this.sessions.forEach(session =>
            contact.note = contact.note + " - " + session.title
        );
        contact.save().then((contact) => {
            console.log('CONTACT SAVED');
            this.displayToast("Contact ajouté", 2000);
        }, (error) => {
            console.error(error);
        })
    }

}

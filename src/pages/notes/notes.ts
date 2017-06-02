import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { SQLite, Camera, MediaCapture, CaptureAudioOptions, CaptureVideoOptions, MediaFile, CaptureError, FileOpener, ActionSheet, SocialSharing } from "ionic-native";
import { NotesService } from '../../providers/notes-service';

@Component({
    selector: 'page-notes',
    templateUrl: 'notes.html'
})
export class NotesPage {

    session: any;
    notes: any;
    database: SQLite;
    pictures = [];
    audios = [];
    videos = [];
    private notesId: any;

    constructor(public navCtrl: NavController, public params: NavParams, public toastCtrl: ToastController, public notesService: NotesService) {
        this.session = params.get("session");
        this.load();
    }

    displayToast(message, duration) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration
        })
        toast.present(toast);
    }

    saveNotes() {
        if (this.notesId !== undefined) {
            this.notesService.updateNote(this.notesId, this.notes).then((data) => {
                console.log("UPDATED: " + JSON.stringify(data));
                this.displayToast("Notes sauvegardées", 2000);
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
        } else {
            this.notesService.addNote(this.notes, this.session.id).then((data) => {
                console.log("INSERTED: " + JSON.stringify(data));
                this.displayToast("Notes sauvegardées", 2000);
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
        }
    }

    load() {
        this.notesService.getNotesFromSessionId(this.session.id).then((data) => {
            if (data.rows.length > 0) {
                this.notes = data.rows.item(0).comment;
                this.notesId = data.rows.item(0).id;
            }
            console.log("ROWS SELECTED: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
        this.notesService.getMediaFromSessionId(this.session.id)
        .then((data) => {
            if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                    if (data.rows.item(i).isPicture == 1) {
                        this.pictures.push(data.rows.item(i).image);
                    }
                    else if (data.rows.item(i).isVideo == 1) {
                        this.videos.push({ name: data.rows.item(i).name, path: data.rows.item(i).urlMedia, type: data.rows.item(i).mediaType })
                    } else {
                        this.audios.push({ name: data.rows.item(i).name, path: data.rows.item(i).urlMedia, type: data.rows.item(i).mediaType })
                    }
                }
            }
            console.log("ROWS SELECTED: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

    takePicture() {
        Camera.getPicture({ destinationType: Camera.DestinationType.DATA_URL })
        .then((imageData) => {
            var image = 'data:image/jpeg;base64,' + imageData;
            this.pictures.push(image);
            this.saveImage(image);
        }, (err) => {
            console.log("ERROR: " + JSON.stringify(err));
        });
    }

    addPicture() {
        Camera.getPicture({
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: Camera.DestinationType.DATA_URL
        }).then((imageData) => {
            var image = 'data:image/jpeg;base64,' + imageData;
            this.pictures.push(image);
            this.saveImage(image);
        }, (err) => {
            console.log("ERROR: " + JSON.stringify(err));
        });
    }

    saveImage(image) {
        this.notesService.savePicture(image, this.session.id)
        .then((data) => {
            console.log("INSERTED: " + JSON.stringify(data));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.err));
        });
    }

    captureAudio() {
        let options: CaptureAudioOptions = { limit: 1, duration: 10 };
        MediaCapture.captureAudio(options)
        .then((data: MediaFile[]) => {
                this.audios.push({ name: data[0].name, path: data[0].fullPath, type: data[0].type })
                this.notesService.saveAudio(data[0].name, data[0].fullPath, data[0].type, this.session.id).then((data) => {
                    console.log("INSERTED: " + JSON.stringify(data));
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
            },(error: CaptureError) => {
              console.log("ERROR: " + JSON.stringify(error))
            }
        );
    }

    captureVideo() {
        let options: CaptureVideoOptions = { limit: 1, duration: 10 };
        MediaCapture.captureVideo(options).then(
            (data: MediaFile[]) => {
                this.videos.push({ name: data[0].name, path: data[0].fullPath, type: data[0].type })
                this.notesService.saveVideo(data[0].name, data[0].fullPath, data[0].type, this.session.id).then((data) => {
                    console.log("INSERTED: " + JSON.stringify(data));
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
            },
            (error: CaptureError) => console.log("ERROR: " + JSON.stringify(error))
        );
    }

    openWithDefaultPlayer(media) {
        FileOpener.open(media.path,media.type)
        .then(() => {
            console.log("FILE OPENED");
        },(error: CaptureError) =>
            console.log("ERROR: " + JSON.stringify(error))
        );
    }

    onImageTouch(picture) {
        let buttonLabels = ['Supprimer', 'Partager'];
        ActionSheet.show({
            'title': 'Que faire aevc l\'image?',
            'buttonLabels': buttonLabels,
            addCancelButtonWithLabel: 'Annuler'
        }).then((buttonIndex: number) => {
            if (buttonIndex == 1) {
                var i = this.pictures.indexOf(picture);
                if (i != -1) {
                    this.pictures.splice(i, 1);
                }
                this.notesService.deletePicture(picture).then((data) => {
                    console.log("DELETED: " + JSON.stringify(data));
                }, (error) => {
                    console.log("ERROR: " + JSON.stringify(error.err));
                });
            } else if (buttonIndex == 2) {
                SocialSharing.share(this.notes, this.session.title, this.pictures[0], "")
                    .then(() => {
                        console.log("SHARE DONE");
                    },
                    (error) => {
                        console.error("ERROR: " + JSON.stringify(error.err))
                    })
            }
        });
    }

}

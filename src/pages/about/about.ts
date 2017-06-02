import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Device } from 'ionic-native';
import { Network, InAppBrowser } from 'ionic-native';
import { Stepcounter } from 'ionic-native';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    device: any;
    network: any;
    stepCount : any;

    constructor(public navCtrl: NavController) {
        this.device = Device;
        this.network = Network;
        let startingOffset = 0;
        Stepcounter.start(startingOffset).then(onSuccess => console.log('stepcounter-start success', onSuccess), onFailure => console.log('stepcounter-start error', onFailure));
        Stepcounter.getTodayStepCount().then( data => {
          this.stepCount = data;
        })
    }

    goToSocialLink() {
      new InAppBrowser("http://www.cyrilmottier.com/", '_blank');
    }

}

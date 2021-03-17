import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BoundElementProperty } from '@angular/compiler';
import { NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { NetworkService, ConnectionStatus } from 'src/app/services/network.service';
import { Network } from '@ionic-native/network/ngx'


const URL = 'http://liquidearthlake.org/json/getalldistances/' + 35.9049 + '/' + -79.0469;

@Component({
  selector: 'app-add-measurement',
  templateUrl: 'add-measurement.page.html',
  styleUrls: ['add-measurement.page.scss']
})
export class AddMeasurementPage implements OnInit, AfterViewInit {
  @ViewChild('heightInput') heightInput: any;
  @ViewChild('hiddenInput') hiddenInput: ElementRef;


  //If you can see this, you can read!
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  isGeoLocationFound: boolean;
  nearestGauge: any;
  nearestGaugeID: string;
  nearestGaugeIncID: number;

  height_data: any;
  units = "Centimeters";

  gauges = [];
  date: any;
  time: any;
  isBubbleLevelOkay: string;
  gauge_data: any;
  problem_data: any;
  value = 0;
  db = 0;
  spinAlert: any;

  constructor(
    private geolocation: Geolocation,
    private alertController: AlertController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private emailcomposer: EmailComposer,
    private navCtrl: NavController,
    public changeDetectorRef: ChangeDetectorRef,
    private networkService: NetworkService,
    private network: Network,
    private apiService: ApiService,


  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    //subscribes to network to send all requests on connect
    //this.network.onConnect().subscribe(() => {

    //        this.sendSaved();

    //     });

  }

  ngOnInit() {

    this.getCurrentDateTime()
    this.getAllGauges();


    if (!this.isGeoLocationFound) {
      //this.presentAlertPrompt();
    }
    else {
    }

    this.network.onConnect().subscribe(() => {

      this.sendSaved();

    });
  }

  ngAfterViewInit() {
    this.hiddenInput.nativeElement.focus();
    this.heightInput.el.setFocus();
  }

  ionViewWillEnter() {

    // console.log('AddMeasurement Being Viewed');

    let id = this.route.snapshot.paramMap.get('id');
    //  console.log(id);

    if (id != null) {
      // console.log("Changing ID from Route");


      // console.log(this.gauges);

      this.nearestGauge = this.gauges.filter(m => m.id == id)
      this.nearestGaugeID = this.nearestGauge[0].gauge_id;



      //  console.log('New Gauge Value on Entering');
      //  console.log(this.nearestGaugeID);


  


    }


    this.setUnits(id);


    this.hiddenInput.nativeElement.focus();
    this.heightInput.el.setFocus();
    this.presentSpinner();

  }


  async presentAlert() {

    const alert = await this.alertController.create({

      header: 'Report a problem',
      message: 'Please enter the Gauge ID and Problem',
      inputs: [
        {
          name: 'gauge_id',
          type: 'text',
          placeholder: 'Gauge ID'
        },
        {
          name: 'problem',
          type: 'text',
          placeholder: 'Problem'
        }

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel');
          }
        }, {
          text: 'SUBMIT',
          handler: data => {

            this.gauge_data = data.gauge_id;
            this.problem_data = data.problem;
            // console.log(this.gauge_data);
            // console.log(this.problem_data);


            let email = {

              to: 'dipayan5175@gmail.com',
              subject: 'LOCSS App Issue',
              body: 'Gauge ID: ' + this.gauge_data + '  Problem: ' + this.problem_data,
              isHTML: true


            }
            // console.log(email);
            // console.log('Successfully updated');


            this.emailcomposer.open(email);
            // console.log('Successfully sent');

          }
        }
      ]

    });

    await alert.present();
  }

//===

  //Creates Loading Spinner When Called
  async presentSpinner() {

    console.log('Alert Spun')
    this.spinAlert = await this.alertController.create({

      header: `Test Alert`,
      
    }
    )

    await this.spinAlert.present();

    


  }

  //Closes inputted Alert - Assumed to be the Spinner
  //From Present Spinner
  async closeSpinner(spinner) {


  }

//===

  getCurrentDateTime() {
    let date = new Date();
    this.date = moment().format('YYYY-MM-DD');
    this.time = moment().format('HH:mm');
    this.isBubbleLevelOkay = "Yes";
    // console.log(this.date);
    // console.log(this.time);
  }


  // Get The  Geolocation

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.isGeoLocationFound = true;
      let coords = resp.coords.latitude + '/' + resp.coords.longitude;
      if (this.router.url.split('/')[3] && this.router.url.split('/')[3] != 'closest') {
        let gauge = this.gauges.find(g => g.id == parseInt(this.router.url.split('/')[3]));
        coords = gauge.latitude + '/' + gauge.longitude;
      } else if (this.router.url.split('/')[3] && this.router.url.split('/')[3] == 'closest') {
        this.router.navigateByUrl('/tabs/add-measurement');
      }
      this.http.get('http://liquidearthlake.org/json/getnearestgauge/' + coords)
        .subscribe((data: any) => {
          this.nearestGauge = data;
          this.nearestGaugeID = data.gauge_id;
          this.nearestGaugeIncID = data.id;
          this.setUnits(this.nearestGaugeIncID);
          this.hiddenInput.nativeElement.focus();
          this.heightInput.el.setFocus();
        },
          (error: any) => {
            console.log(error);
          });
      // console.log(resp.coords.latitude);
      // console.log(resp.coords.longitude);
    }).catch((error) => {
      this.isGeoLocationFound = false;
      //console.log('Error getting location', error);
    });

  }


  getAllGauges() {
    this.http.get('http://liquidearthlake.org/json/gauges')
      .subscribe((data: any) => {
        this.gauges = data;


        //Behavior Concern - Gaugues are sorted from this console log before sort
        //is performed sequentially below this line. 
        //No impact on functionality, but investigate discrepancy. (2-20-21)
        console.log("Downloaded Gauges");
        console.log(this.gauges);
    
        this.gauges.sort((a, b) => (b['name'] < a['name']) ? 1 : -1);
    
        console.log("Sorted Gauges");
        console.log(this.gauges);
  

        this.getLocation();
      },
        (error: any) => {
          console.log(error);
        });


  }





  async onSubmit(form: NgForm) {
    // Check Network Status before creating toast
    //If Offline, Create Toast to indicate data will be sent when online again.


    let status = this.networkService.getCurrentNetworkStatus();

    if (status === ConnectionStatus.Online) {

      // //console.log('Connected to Network. Submitting Information');




      let toast = await this.toastCtrl.create({
        message: 'Data submitted successfuly',
        duration: 2000,
        position: "bottom"
      });

      toast.present();

      this.nearestGauge = this.gauges.filter(m => m.id == form.value['gauge_inc_id']);
      // //console.log(form);

      //API CALL

      // //console.log('Check Console Here');
      // //console.log(form.value);
      // //console.log('Data JSON Form');
      let result = form.value;
      // //console.log(JSON.stringify({result}));







      //"http://liquidearthlake.org/json/reading/store", form.value
      //"http://liquidearthlake.org/json/store/offline", JSON.stringify({result}))
      //"http://liquidearthlake.org/json/store/offline", result
      //"http://liquidearthlake.org/json/reading/store", JSON.stringify({result})





      this.http.post("http://liquidearthlake.org/json/reading/store", JSON.stringify({ result }), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Methods': 'POST'
        }
      })
        .subscribe(response => {

          //console.log('Response is Here');
          //console.log(JSON.stringify(response));
        }, error => {
          //console.log('Error Printed Here');
          console.log(error);
          //console.log(JSON.stringify(error));
        });

      //console.log(this.gauges);

      //console.log(this.nearestGauge[0].gauge_id);
      this.router.navigateByUrl('tabs/view-gauge/' + form.value['gauge_inc_id'] + '/' + this.nearestGauge[0].gauge_id);
    }
    else {

      //console.log('Not connected to Network. Saving submission.');



      // Method to Store Data in Ionic Storage
      // This data must be retrieved whenever the app goes online.

      this.apiService.handleRequest(form.value, this.db);
      this.db++;
    }

  }

  async sendSaved() {

    //console.log('Sending any saved requests.')

    for (this.db; this.db >= 0; this.db--) {

      this.apiService.getRequest(this.db).then((result) => {


        if (result != null) {
          //API CALL

          //console.log('Sending non-null request');

          //console.log(result);
          //console.log('Data JSON Form');
          //console.log(JSON.stringify({result}));


          this.http.post("http://liquidearthlake.org/json/reading/store", JSON.stringify({ result }), {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Methods': 'POST'
            }
          })
            .subscribe(response => {

              //console.log('Response is Here');
              //console.log(JSON.stringify(response));
            }, error => {
              //console.log('Error Printed Here');
              console.log(error);
              //console.log(JSON.stringify(error));
            });

          console.log(this.db);
          //console.log('Request Sent');

        }
      });
      let toast = await this.toastCtrl.create({
        message: 'Offline Requests Successfully Sent',
        duration: 2000,
        position: "bottom"
      });

      this.apiService.clearStorage(this.db);
    }

    if (this.db < 0) {
      this.db = 0;
    }
  }


  OnChange(event) {

    //console.log(this.gauges);
    this.nearestGauge = this.gauges.filter(m => m.id == event.target.value)
    this.nearestGaugeID = this.nearestGauge[0].gauge_id;
    //console.log('New Gauge Value');
    //console.log(this.nearestGaugeID);

    this.setUnits(event.target.value);



  }

  setUnits(id) {

    //console.log("Setting Units");

    this.http
      .get('http://liquidearthlake.org/json/getgauge/' + id)
      .subscribe((data: any) => {

        this.height_data = data;



        if (this.height_data[0].unit == "FEET") {

          this.units = "Feet";

        }
        else if (this.height_data[0].unit == "METER") {

          this.units = "Meters";

        }
        else if (this.height_data[0].unit == "CENTIMETER") {


          this.units = "Centimeters";

        }


        //console.log(this.units);
        this.hiddenInput.nativeElement.focus();
        this.heightInput.el.setFocus();

      },
        (error: any) => {
          console.log(error);
        });

  }

}
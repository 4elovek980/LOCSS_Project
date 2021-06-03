import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform, NavController, LoadingController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { NgxSpinnerService } from "ngx-spinner";

declare var google;

@Component({
  selector: 'app-gauge-list-map',
  templateUrl: './gauge-list-map.page.html',
  styleUrls: ['./gauge-list-map.page.scss'],
})
export class GaugeListMapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  //lat:any;
  //long:any;

  // Newly created variables by Dip 
  //resp:any;
  isGeoLocationFound: boolean;
  location = { lat: null, lng: null };
  mapOptions: any;

  gauge_data: any;
  error: any;
  loading: any;
  marker: any;


  constructor(public loadingcontrl: LoadingController, 
    private splash: SplashScreen, 
    public geolocation: Geolocation, 
    private platform: Platform, 
    private http: HttpClient, 
    public navctrl: NavController, 
    private spinner: NgxSpinnerService,
    private router: Router) {


  }

  ngOnInit() {
    //console.log("Ionview");
    //this.splash.show();
    this.spinner.show();
    this.addMarkerToMap();
    this.locate();


    //this.loading.dismissAll();
    this.splash.hide();

  }


  locate() {

    this.geolocation.getCurrentPosition().then((resp) => {

      this.isGeoLocationFound = true;
      //console.log('Current Position: ', resp.coords.latitude, resp.coords.longitude);
      //  let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      this.location.lat = resp.coords.latitude;
      this.location.lng = resp.coords.longitude;

      //console.log(this.location);
      this.mapOptions = {


        center: this.location,
        zoom: 8,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        eneableHighAccuracy: true
        
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
      this.addMarkerToMap();

      this.spinner.hide();
    }).catch((error) => {

      this.isGeoLocationFound = false;
      this.spinner.hide();
      //console.log('Error getting location', error);
    });
  }




  // Main code: Written by Arman
  /*
  locate(){
  
  
          
        ////console.log(resp.coords.latitude);  
       //let latLng = new google.maps.LatLng(this.resp.coords.latitude, this.resp.coords.longitude);
       ////console.log(latLng);
       // let latLng = new google.maps.LatLng(36.183670857, -85.5016);
        ////console.log(latLng);
        let mapOptions = {
          
         // center:latLng,
         center: {lat: 35.1085, lng:-77.0441},
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
      
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
  }
  */

  addMarkerToMap() {
    this.http.get('https://liquidearthlake.org/json/gauges')
      .subscribe((gauges: any) => {

        //console.log(gauges);
        for (var i = 0; i < gauges.length; i++) {
          var label = gauges[i].gauge_id + ":" + gauges[i].name;
          this.addMarker(Number(gauges[i].latitude), Number(gauges[i].longitude), label, gauges[i].id, gauges[i].name);
          ////console.log("success",label);
        }


      },
        (error: any) => {
          console.log(error);
        });
  }

  addMarker(lat, lng, label, id, name) {
    var coords = { lat: lat, lng: lng };
    //console.log(coords);

    var marker = new google.maps.Marker(
      {
        position: coords,
        map: this.map

      }
    );
    var infoWindow = new google.maps.InfoWindow({
      content: label
    });

    //console.log('tabs/view-gauge/'+id+'/'+name);
    marker.addListener('click', () => {
      this.router.navigateByUrl('tabs/view-gauge/' + id + '/' + name);

    });



  }

}
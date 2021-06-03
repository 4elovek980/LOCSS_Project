import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import * as $ from 'jquery';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-view-gauge',
  templateUrl: 'view-gauge.page.html',
  styleUrls: ['view-gauge.page.scss']
})

export class ViewGaugePage {

  constructor(private alertController: AlertController, private http: HttpClient, private route: ActivatedRoute, private router: Router,
  
  private spinner: NgxSpinnerService,
  private splash: SplashScreen) { }
  @ViewChild('barCanvas') barCanvas;

  barChart: any;
  data: any;
  height_data: any;
  name: any;
  loadAllData: boolean;
  id: any;
  buttonVal = 0;

  ngOnInit() {
    this.spinner.show();
    this.loadAllData = false;
    this.getHeight();
    this.splash.hide();
  }

  goBack() {
    window.history.back();
  }

  getReadingsForTable(range) {
    let id = this.route.snapshot.paramMap.get('id');

    //console.log("Id for Readings");
    //console.log(id);

    var source;

    if (range == 0) {
      //All Data
      let source = ('https://liquidearthlake.org/json/getjsondataall/' + id);

      //console.log("Source for table");
      //console.log(source);

      this.http
        .get(source)
        .subscribe((data: any) => {

          this.data = data;
          //console.log(data);


        },
          (error: any) => {
            console.log(error);
          });

    }
    else if (range == 1) {
      //One Year
      let source = ('https://liquidearthlake.org/json/getjsondataoney/' + id);


      //console.log("Source for table");
      //console.log(source);

      this.http
        .get(source)
        .subscribe((data: any) => {

          this.data = data;
          //console.log(data);


        },
          (error: any) => {
            console.log(error);
          });

    }
    else if (range == 2) {
      //Three Months
      let source = ('https://liquidearthlake.org/json/getjsondatathreem/' + id);


      //console.log("Source for table");
      //console.log(source);

      this.http
        .get(source)
        .subscribe((data: any) => {

          this.data = data;
          //console.log(data);


        },
          (error: any) => {
            console.log(error);
          });

    }
    else if (range == 3) {
      //One Month
      let source = ('https://liquidearthlake.org/json/getjsondataonem/' + id);


      //console.log("Source for table");
      //console.log(source);

      this.http
        .get(source)
        .subscribe((data: any) => {

          this.data = data;
          //console.log(data);


        },
          (error: any) => {
            console.log(error);
          });

    }
    else {
      //Default Six Months
      let source = ('https://liquidearthlake.org/json/getjsondatasixm/' + id);

      //console.log("Source for table");
      //console.log(source);

      this.http
        .get(source)
        .subscribe((data: any) => {

          this.data = data;
          //console.log(data);


        },
          (error: any) => {
            console.log(error);
          });


    }


  }

  getHeight() {

    let id = this.route.snapshot.paramMap.get('id');
    //let variable = this.route.snapshot.paramMap.get('unit');
    ////console.log('hi' + variable);

    //console.log("Id for height");
    //console.log(id);


    this.http
      .get('https://liquidearthlake.org/json/getgauge/' + id)
      .subscribe((data: any) => {

        this.height_data = data;
        //console.log(this.height_data[0].unit);
        this.getReadings();
        this.getReadingsForTable(6);
        this.spinner.hide();
      },
        (error: any) => {
          console.log(error);
          this.spinner.hide();
        });

  }


  getReadings() {

    //console.log(this.height_data);

    var scale_size = 15;
    var reading_date = [];
    var reading_height = [];
    let id = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');


    //'https://liquidearthlake.org/gauge/getjsondatasixm?gauge_inc_id='+id
    //https://liquidearthlake.org/json/getsixchart?gauge_inc_id



    this.http
      .get('https://liquidearthlake.org/json/getsixchart?gauge_inc_id=' + id)
      .subscribe((data: any) => {
        //this.data =data;

        //console.log('Original Data');
        //console.log(this.data);
        //console.log('Data Check');
        //console.log(JSON.stringify(this.data));

        //console.log(data.length);

        if (data.length != 0) {

          for (var i = 0; i < data.length; ++i) {
            reading_date.push(this.formatedate(String(data[i].date)));
            //console.log(data[i].height);
            reading_height.push(data[i].height);

          }
          var start_date = this.formatedate(String(data[0].date));
          var start_date1 = moment(start_date);

          //console.log(start_date1);


          var end_date = this.formatedate(String(data[data.length - 1].date));
          //console.log(end_date);

          var end_date1 = moment(end_date);
          var modified_end_date;
          var diff_date_in_days = end_date1.diff(start_date1, 'days');
          //console.log(diff_date_in_days);


          if (diff_date_in_days % scale_size != 0) {
            modified_end_date = end_date1;
          }
          else {
            var num_steps_x_axis = diff_date_in_days / scale_size;
            modified_end_date = start_date1.add((num_steps_x_axis + 1) * scale_size, 'days');
          }
          //console.log(modified_end_date);

          if (this.barChart) {
            //console.log('Destroying Chart');

            this.barChart.destroy();
          }

          this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'line',
            data: {
              labels: reading_date,
              datasets: [{
                label: 'Lake Level',
                data: reading_height,
                lineTension: 0.25,
                fill: false,
                borderColor: 'rgba(65,105,225,1)',
                backgroundColor: 'transparent',
                pointBorderColor: 'rgba(65,105,225,1)',
                pointBackgroundColor: 'rgba(65,105,225,1)',
                borderWidth: 2,
                borderDash: [0, 0],
                pointRadius: 2,
                pointHoverRadius: 4,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'

              }]
            },
            options: {
              legend: {
                display: false,
                position: 'top',
                labels: {
                  boxWidth: 80,
                  fontColor: 'black'
                }
              },
              scales: {
                xAxes: [{
                  type: "time",
                  time: {
                    unit: 'day',
                    unitStepSize: scale_size,
                    max: modified_end_date,
                    tooltipFormat: "MM/DD/YYYY",
                    displayFormats: {
                      day: 'MM/DD/YYYY'
                    }
                  }
                }],
                yAxes: [{
                  gridLines: {
                    //color: "black",
                    // borderDash: [2, 5],
                  },


                  scaleLabel: {
                    display: true,
                    labelString: (this.height_data[0].unit),
                    fontColor: "green"

                  }
                }]
              }
            }

          });

        }
        else {

          if (this.barChart) {

            //console.log('Destroying Other Chart');
            this.barChart.destroy();
          }
          this.presentAlert();


        }
      },
        (error: any) => {
          console.log(error);
        });

    this.getReadingsForTable(6);
    this.changeButtonColor(2);

  }


  //'https://liquidearthlake.org/gauge/getjsondatasixm?gauge_inc_id='+id
  //'https://liquidearthlake.org/gauge/getjsondatathreem?gauge_inc_id='+ id
  //'https://liquidearthlake.org/json/getthreechart?gauge_inc_id='+id


  getReadingsThree() {
    var scale_size = 10000;
    var reading_date = [];
    var reading_height = [];
    let id = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');
    this.http
      .get('https://liquidearthlake.org/json/getthreechart?gauge_inc_id=' + id)
      .subscribe((data: any) => {
        //this.data =data;

        //console.log('Original Data');
        //console.log(this.data);
        //console.log('Data Check');
        //console.log(JSON.stringify(this.data));

        //console.log(data.length);

        if (data.length != 0) {

          for (var i = 0; i < data.length; ++i) {
            reading_date.push(this.formatedate(String(data[i].date)));
            //console.log(data[i].height);
            reading_height.push(data[i].height);

          }
          var start_date = this.formatedate(String(data[0].date));
          var start_date1 = moment(start_date);

          //console.log(start_date1);


          var end_date = this.formatedate(String(data[data.length - 1].date));
          //console.log(end_date);

          var end_date1 = moment(end_date);
          var modified_end_date;
          var diff_date_in_days = end_date1.diff(start_date1, 'days');
          //console.log(diff_date_in_days);


          if (diff_date_in_days % scale_size != 0) {
            modified_end_date = end_date1;
          }
          else {
            var num_steps_x_axis = diff_date_in_days / scale_size;
            modified_end_date = start_date1.add((num_steps_x_axis + 1) * scale_size, 'days');
          }
          //console.log(modified_end_date);

          if (this.barChart) {
            //console.log('Destroying Chart');

            this.barChart.destroy();
          }

          this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'line',
            data: {
              labels: reading_date,
              datasets: [{
                label: 'Lake Level',
                data: reading_height,
                lineTension: 0.25,
                fill: false,
                borderColor: 'rgba(65,105,225,1)',
                backgroundColor: 'transparent',
                pointBorderColor: 'rgba(65,105,225,1)',
                pointBackgroundColor: 'rgba(65,105,225,1)',
                borderWidth: 2,
                borderDash: [0, 0],
                pointRadius: 2,
                pointHoverRadius: 4,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'

              }]
            },
            options: {
              legend: {
                display: false,
                position: 'top',
                labels: {
                  boxWidth: 80,
                  fontColor: 'black'
                }
              },
              scales: {
                xAxes: [{
                  type: "time",
                  time: {
                    unit: 'day',
                    unitStepSize: scale_size,
                    max: modified_end_date,
                    tooltipFormat: "MM/DD/YYYY",
                    displayFormats: {
                      day: 'MM/DD/YYYY'
                    }
                  }
                }],
                yAxes: [{
                  gridLines: {
                    //color: "black",
                    // borderDash: [2, 5],
                  },


                  scaleLabel: {
                    display: true,
                    labelString: (this.height_data[0].unit),
                    fontColor: "green"

                  }
                }]
              }
            }

          });

        }
        else {
          if (this.barChart) {

            //console.log('Destroying Other Chart');
            this.barChart.destroy();
          }
          this.presentAlert();
        }

      },
        (error: any) => {
          console.log(error);
        });

    this.getReadingsForTable(2);
    this.changeButtonColor(3);


  }

  //'https://liquidearthlake.org/gauge/getjsondataall?gauge_inc_id='+ id
  //https://liquidearthlake.org/json/getallchart?gauge_inc_id=

  getReadingsAll() {
    var scale_size = 100;
    var reading_date = [];
    var reading_height = [];
    let id = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');
    this.http
      .get('https://liquidearthlake.org/json/getallchart?gauge_inc_id=' + id)
      .subscribe((data: any) => {
        //this.data =data;
        //console.log(this.data);

        if (data.length != 0) {

          for (var i = 0; i < data.length; ++i) {
            reading_date.push(this.formatedate(String(data[i].date)));
            reading_height.push(data[i].height);

          }
          var start_date = this.formatedate(String(data[0].date));
          var start_date1 = moment(start_date);
          var end_date = this.formatedate(String(data[data.length - 1].date));
          var end_date1 = moment(end_date);
          var modified_end_date;
          var diff_date_in_days = end_date1.diff(start_date1, 'days');
          if (diff_date_in_days % scale_size == 0) {
            modified_end_date = end_date1;
          }
          else {
            var num_steps_x_axis = diff_date_in_days / scale_size;
            modified_end_date = start_date1.add((num_steps_x_axis + 1) * scale_size, 'days');
          }
          //console.log(modified_end_date);

          if (this.barChart) {
            //console.log('Destroying Chart');

            this.barChart.destroy();
          }

          this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'line',
            data: {
              labels: reading_date,
              datasets: [{
                label: 'Lake Level',
                data: reading_height,
                lineTension: 0.25,
                fill: false,
                borderColor: 'rgba(65,105,225,1)',
                backgroundColor: 'transparent',
                pointBorderColor: 'rgba(65,105,225,1)',
                pointBackgroundColor: 'rgba(65,105,225,1)',
                borderWidth: 2,
                borderDash: [0, 0],
                pointRadius: 2,
                pointHoverRadius: 4,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'

              }]
            },
            options: {
              legend: {
                display: false,
                position: 'top',
                labels: {
                  boxWidth: 80,
                  fontColor: 'black'
                }
              },
              scales: {
                xAxes: [{
                  type: "time",
                  time: {
                    unit: 'day',
                    unitStepSize: scale_size,
                    max: modified_end_date,
                    tooltipFormat: "MM/DD/YYYY",
                    displayFormats: {
                      day: 'MM/DD/YYYY'
                    }
                  }
                }],
                yAxes: [{
                  gridLines: {
                    //color: "black",
                    // borderDash: [2, 5],
                  },
                  scaleLabel: {
                    display: true,
                    labelString: (this.height_data[0].unit),
                    fontColor: "green"
                  }
                }]
              }
            }

          });
        }
        else {

          if (this.barChart) {

            //console.log('Destroying Other Chart');
            this.barChart.destroy();
          }
          this.presentAlert();

        }

      },
        (error: any) => {
          console.log(error);
        });

    this.getReadingsForTable(0);
    this.changeButtonColor(0);

  }


  getReadingsOney() {
    var scale_size = 50;
    var reading_date = [];
    var reading_height = [];
    let id = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');

    //'https://liquidearthlake.org/gauge/getjsondataoney?gauge_inc_id='+ id
    //https://liquidearthlake.org/json/getyearchart?gauge_inc_id=

    this.http
      .get('https://liquidearthlake.org/json/getyearchart?gauge_inc_id=' + id)
      .subscribe((data: any) => {
        //this.data =data;
        //console.log(this.data);

        if (data.length != 0) {
          for (var i = 0; i < data.length; ++i) {
            reading_date.push(this.formatedate(String(data[i].date)));
            reading_height.push(data[i].height);

          }
          var start_date = this.formatedate(String(data[0].date));
          var start_date1 = moment(start_date);
          var end_date = this.formatedate(String(data[data.length - 1].date));
          var end_date1 = moment(end_date);
          var modified_end_date;
          var diff_date_in_days = end_date1.diff(start_date1, 'days');
          if (diff_date_in_days % scale_size == 0) {
            modified_end_date = end_date1;
          }
          else {
            var num_steps_x_axis = diff_date_in_days / scale_size;
            modified_end_date = start_date1.add((num_steps_x_axis + 1) * scale_size, 'days');
          }
          //console.log(modified_end_date);

          if (this.barChart) {
            //console.log('Destroying Chart');

            this.barChart.destroy();
          }

          this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'line',
            data: {
              labels: reading_date,
              datasets: [{
                label: 'Lake Level',
                data: reading_height,
                lineTension: 0.25,
                fill: false,
                borderColor: 'rgba(65,105,225,1)',
                backgroundColor: 'transparent',
                pointBorderColor: 'rgba(65,105,225,1)',
                pointBackgroundColor: 'rgba(65,105,225,1)',
                borderWidth: 2,
                borderDash: [0, 0],
                pointRadius: 2,
                pointHoverRadius: 4,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'

              }]
            },
            options: {
              legend: {
                display: false,
                position: 'top',
                labels: {
                  boxWidth: 80,
                  fontColor: 'black'
                }
              },
              scales: {
                xAxes: [{
                  type: "time",
                  time: {
                    unit: 'day',
                    unitStepSize: scale_size,
                    max: modified_end_date,
                    tooltipFormat: "MM/DD/YYYY",
                    displayFormats: {
                      day: 'MM/DD/YYYY'
                    }
                  }
                }],
                yAxes: [{
                  gridLines: {
                    //color: "black",
                    // borderDash: [2, 5],
                  },
                  scaleLabel: {
                    display: true,
                    labelString: (this.height_data[0].unit),
                    fontColor: "green"
                  }
                }]
              }
            }
          });
        } else {
          if (this.barChart) {
            //console.log('Destroying Other Chart');
            this.barChart.destroy();
          }
          this.presentAlert();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
    this.getReadingsForTable(1);
    this.changeButtonColor(1);

  }

  getReadingsOnem() {
    var scale_size = 100;
    var reading_date = [];
    var reading_height = [];
    let id = this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');

    //'https://liquidearthlake.org/gauge/getjsondataonem?gauge_inc_id='+ id
    //https://liquidearthlake.org/json/getonechart?gauge_inc_id=

    this.http
      .get('https://liquidearthlake.org/json/getonechart?gauge_inc_id=' + id)
      .subscribe((data: any) => {
        //this.data =data;
        //console.log(this.data);

        if (data.length != 0) {

          for (var i = 0; i < data.length; ++i) {
            reading_date.push(this.formatedate(String(data[i].date)));
            reading_height.push(data[i].height);

          }
          var start_date = this.formatedate(String(data[0].date));
          var start_date1 = moment(start_date);
          var end_date = this.formatedate(String(data[data.length - 1].date));
          var end_date1 = moment(end_date);
          var modified_end_date;
          var diff_date_in_days = end_date1.diff(start_date1, 'days');

          //console.log(diff_date_in_days);
          if (diff_date_in_days % scale_size == 0) {
            modified_end_date = end_date1;
            //console.log(end_date1);
          }
          else {
            var num_steps_x_axis = diff_date_in_days / scale_size;
            modified_end_date = start_date1.add((num_steps_x_axis + 1) * scale_size, 'days');
          }
          //console.log(modified_end_date);


          if (this.barChart) {
            //console.log('Destroying Chart');

            this.barChart.destroy();
          }

          this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'line',
            data: {
              labels: reading_date,
              datasets: [{
                label: 'Lake Level',
                data: reading_height,
                lineTension: 0.25,
                fill: false,
                borderColor: 'rgba(65,105,225,1)',
                backgroundColor: 'transparent',
                pointBorderColor: 'rgba(65,105,225,1)',
                pointBackgroundColor: 'rgba(65,105,225,1)',
                borderWidth: 2,
                borderDash: [0, 0],
                pointRadius: 2,
                pointHoverRadius: 4,
                pointHitRadius: 30,
                pointBorderWidth: 2,
                pointStyle: 'rectRounded'

              }]
            },
            options: {
              legend: {
                display: false,
                position: 'top',
                labels: {
                  boxWidth: 80,
                  fontColor: 'black'
                }
              },
              scales: {
                xAxes: [{
                  type: "time",
                  time: {
                    unit: 'day',
                    unitStepSize: scale_size,
                    max: modified_end_date,
                    tooltipFormat: "MM/DD/YYYY",
                    displayFormats: {
                      day: 'MM/DD/YYYY'
                    }
                  }
                }],
                yAxes: [{
                  gridLines: {
                    //color: "black",
                    // borderDash: [2, 5],
                  },
                  scaleLabel: {
                    display: true,
                    labelString: (this.height_data[0].unit),
                    fontColor: "green"
                  }
                }]
              }
            }
          });
        } else {
          if (this.barChart) {
            //console.log('Destroying Other Chart');
            this.barChart.destroy();
          }
          this.presentAlert();
        }
      },
      (error: any) => {
        console.log(error);
      });
    this.getReadingsForTable(3);
    this.changeButtonColor(4);
  }


  changeButtonColor(buttonNumber) {
    this.buttonVal = buttonNumber;
  }

  async presentAlert() {

    const alert = await this.alertController.create({

      header: 'No Data Available',
      message: 'No Data Found for Specified Range',
      buttons: [
        {
          text: 'Okay'
        }
      ]
    })
    await alert.present();
  }

  formatedate(date) {
    return moment().format(date);
  }

  LoadAllReadings() {
    this.loadAllData = true;
  }

  goToPage() {
    let id = this.route.snapshot.paramMap.get('id');
    //console.log("ID for add measurement");
    //console.log(id);
    this.router.navigate(['tabs/add-measurement', { id: id }]);
  }

}
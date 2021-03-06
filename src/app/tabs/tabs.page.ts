import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public notifyAddMeasurement: Subject<any>;

  constructor(private router: Router) { }

  onClickAddMeasurement() {
    if (this.router.url.indexOf('tabs/view-gauge') > -1 || (this.router.url.indexOf('tabs/add-measurement') > -1 && this.router.url.split('/').length > 3)) {
      this.router.navigateByUrl('/tabs/add-measurement/' + this.router.url.split('/')[3]);
    } else {
      this.router.navigateByUrl('/tabs/add-measurement');
    }
  }
}

import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, BehaviorSubject } from 'rxjs';
import { StateService } from '@app/state.service';
import { RouterOutlet } from '@angular/router';
import { fader } from '@app/route-animations';
import { slider } from '../route-animations';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
  animations: [slider]
})
export class FrameComponent {
  public isProjectSet$ = new BehaviorSubject<boolean>(false);
  public showDrawer = true;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(private breakpointObserver: BreakpointObserver, public ss: StateService) {
    ss.state$.pipe(
      map(state => (state.project != null))
    ).subscribe(this.isProjectSet$);
  }

  logMenuToggle(): void {
    this.showDrawer = !this.showDrawer;
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}

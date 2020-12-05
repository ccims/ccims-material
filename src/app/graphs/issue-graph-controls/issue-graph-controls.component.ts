import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StateService } from '@app/state.service';
import { ActivatedRoute } from '@angular/router';
import { IssueGraphComponent } from '../issue-graph/issue-graph.component';
import { IssueCategory } from 'src/generated/graphql';
import { BehaviorSubject, Observable, combineLatest, ReplaySubject } from 'rxjs';
import { SelectedCategories } from '../shared';
import { IssueGraphStateService } from '../../data/issue-graph/issue-graph-state.service';
import { LabelSearchComponent } from '../label-search/label-search.component';
import { map, takeUntil } from 'rxjs/operators';
import { FilterState } from '@app/graphs/shared';

@Component({
  selector: 'app-issue-graph-controls',
  templateUrl: './issue-graph-controls.component.html',
  styleUrls: ['./issue-graph-controls.component.scss']
})
export class IssueGraphControlsComponent implements AfterViewInit, OnDestroy {
  @ViewChild(IssueGraphComponent) issueGraph: IssueGraphComponent;
  @ViewChild(LabelSearchComponent) labelSearch: LabelSearchComponent;
  projectId: string;

  featureRequests = true;
  bug = true;
  unclassified = true;

  showRelations = true;
  filter$: BehaviorSubject<FilterState>;
  private destroy$ = new ReplaySubject(1);

  constructor(public dialog: MatDialog, private gs: IssueGraphStateService, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.filter$ = new BehaviorSubject({
      selectedCategories: this.getSelectedCategories(), selectedFilter: {
        labels: [], texts: []
      }
    });
  }

  public selectedCategories$ = new BehaviorSubject<SelectedCategories>(
    this.getSelectedCategories()
  );

  public updateSelectedCategories() {
    this.selectedCategories$.next(
      this.getSelectedCategories());
  }

  private getSelectedCategories(): SelectedCategories {
    return {
      [IssueCategory.Bug]: this.bug,
      [IssueCategory.FeatureRequest]: this.featureRequests,
      [IssueCategory.Unclassified]: this.unclassified,
    };
  }

  ngAfterViewInit(): void {
    combineLatest([this.selectedCategories$, this.labelSearch.filterSelection$]).pipe(
      takeUntil(this.destroy$),
      map(([selectedCategories, filterSelection]) => ({ selectedCategories, selectedFilter: filterSelection }))
    ).subscribe(filterState => this.filter$.next(filterState));

    this.gs.graphDataForFilter(this.filter$, this.issueGraph.reload$).pipe(
      takeUntil(this.destroy$)).subscribe(
      graphData => {
        this.issueGraph.graphData = graphData;
        this.issueGraph.drawGraph();
      }
    );
  }

  setRelationVisibility(): void {
    this.issueGraph.setRelationVisibility(this.showRelations);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { GetFullProjectQuery } from 'src/generated/graphql';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-project-issue-list',
  templateUrl: './project-issue-list.component.html',
  styleUrls: ['./project-issue-list.component.scss']
})
export class ProjectIssueListComponent implements OnInit {
  public projectId: string;
  public project$: Observable<GetFullProjectQuery>;
  public project: GetFullProjectQuery;
  constructor(private route: ActivatedRoute, private projectStore: ProjectStoreService) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.project$ = this.projectStore.getFullProject(this.projectId);
    this.project$.subscribe(project => {
      this.project = project;
    });
  }

}

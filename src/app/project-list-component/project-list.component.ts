import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from 'src/dialogs/create-project-dialog/create-project-dialog.component';
import { Project } from 'src/generated/graphql';
import { ProjectStoreService } from '../data/project/project-store.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  pendingCreate = false;
  projectName?: string;
  projects: Pick<Project, 'id' | 'name'>[];
  constructor(private ps: ProjectStoreService, private dialog: MatDialog) { }

  createProject() {
    this.ps.create();
  }
  ngOnInit(): void {
    this.ps.getAll().subscribe(projects => this.projects = projects);
    // For Testing pupose only has to be deleted for production use
    this.projects=[{name:'erstes',id:'1'},{name:'ezweites Projekt',id:'2'},
    {name:'drittes Projekt',id:'3'},{name:'viertes Projekt',id:'4'}];
  }
  remove(project: Project) {
    console.log('Removing ' + project);
  }
  public openCreateProjectDialog(): void {

    const createComponentDialogRef = this.dialog.open(CreateProjectDialogComponent);
    createComponentDialogRef.afterClosed().subscribe(result => {
      console.log('data is saved ');
      if (result){
        this.projects.push({name: result, id: '5'});
        // createProject(result);
      }


    });
}}

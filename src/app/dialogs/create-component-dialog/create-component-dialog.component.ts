import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { GraphComponent } from '../../model/state';
//import { IssueGraphComponent } from '@app/graphs/issue-graph/issue-graph.component';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { GraphStoreService } from '@app/graphs/graph-store.service';
@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.scss']
})
export class CreateComponentDialogComponent implements OnInit {
  @Input() name: string;
  @Input () url: string;
  @Input () description: string;
  public loading: boolean;
  public saveFailed: boolean;
  validateForm!: FormGroup;
  private zeroPosition: Point = {x: 0, y: 0};
  //private gs:GraphStoreService;
  constructor(public dialogRef: MatDialogRef<CreateComponentDialogComponent>, private fb: FormBuilder,
              private gs: GraphStoreService) { this.loading = false; }

  validationName = new FormControl('', [Validators.required]);
  validationUrl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      url:  [null, [Validators.required]]
    });
  }

  onNoClick(): void {
    // console.log(this.name);
    this.dialogRef.close();
  }

  onOkClick(name: string, url: string, description:string): void{
    // check for valid form
    Object.keys(this.validateForm.controls).forEach(controlKey => {
      this.validateForm.controls[controlKey].markAsDirty();
      this.validateForm.controls[controlKey].updateValueAndValidity();
    });
    this.loading = true;
    let component: GraphComponent;
    // TODO: Anfrage Backend --> Componente Anlegen
    // TODO: ID entgegennehmen und der Komponente hinzufügen
     // copied state
    component = {
      id: '1000',
      name: this.name,
      description: this.description,
      imsId: null,
      imsRepository: null,
      owner: null,
      interfaces: {},
      issueCounts: {
      UNCLASSIFIED: 0,
      BUG: 1,
      FEATURE_REQUEST: 2
    },
    issues: [],
    position: this.zeroPosition,
    componentRelations: []
    }; // copied state

    // TODO: Update Graph State
     // this.gs.addComponent(component);  // does not work

    this.loading = false;
    if (!this.saveFailed){
      this.dialogRef.close(component);
    }
  }
  afterAlertClose(): void {
    this.saveFailed = false;
  }
}
export interface ComponentInformation {
  name: string;
  url: string;


}

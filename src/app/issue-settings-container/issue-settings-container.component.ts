import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStoreService } from '@app/data/component/component-store.service';
import { AddLabelToIssueInput, GetComponentQuery, GetIssueQuery, GetProjectQuery, Label, LinkIssueInput, RemoveLabelFromIssueInput, UnlinkIssueInput } from 'src/generated/graphql';
import { Observable } from 'rxjs';
import { LabelStoreService } from '@app/data/label/label-store.service';
import { element } from 'protractor';
import { ProjectStoreService } from '@app/data/project/project-store.service';
import { IssueStoreService } from '@app/data/issue/issue-store.service';
@Component({
  selector: 'app-issue-settings-container',
  templateUrl: './issue-settings-container.component.html',
  styleUrls: ['./issue-settings-container.component.scss']
})
export class IssueSettingsContainerComponent implements OnInit {
  @Input() selection;
  @Input() currentIssue: GetIssueQuery;
  @Input() selectedLabels: Array<string>;
  @Output() messageEvent = new EventEmitter<boolean>();

  public labels: Label[];
  public issueComponent: GetComponentQuery;
  public issueComponent$: Observable<GetComponentQuery>;
  issuesLoaded = false;
  selectedIssues: any = [];
  linkableProjectIssues: any = [];
  constructor(private activatedRoute: ActivatedRoute, private componentStoreService: ComponentStoreService,
              private labelStoreService: LabelStoreService, private projectStoreService: ProjectStoreService,
              private issueStoreService: IssueStoreService) { }

  ngOnInit(): void {


    this.issueComponent$ = this.componentStoreService.getFullComponent(this.activatedRoute.snapshot.paramMap.get('componentId'));
    this.issueComponent$.subscribe(component => {
      this.issueComponent = component;
      this.labels = component.node.labels.nodes;
    });
    this.prepareLinkableIssues();

  }
  @HostListener('document:click', ['$event'])
  clickout($event) {
    let close = true;
    $event.path.forEach(element => {
      if (element.classList && element.classList.contains('settings')) {
        close = false;
      }
    });
    if ($event.target.outerText !== 'settings' && close === true) {
      this.saveChanges();
       // if (this.saveChanges()) { this.messageEvent.emit(true); }
    }


  }
  private saveChanges(): boolean {
    if (this.selection === 'labels') {
      const remove = this.getLabelsToRemove();
      const add = this.getLabelsToAdd();

      this.removeLabelsFromIssue(remove);
      this.addLabelsToIssue(add);
      if (remove.length < 1 && add.length < 1){this.messageEvent.emit(false); }
      return true;
    }

    if (this.selection === 'assignees') {
      // assignees speichern

    }
    if (this.selection === 'link') {
      // linked Issues speichern
      const remove = this.getIssuesToRemove();
      const add = this.getIssuesToAdd();

      this.unlinkIssues(remove);
      this.linkIssues(add);
      if (remove.length < 1 && add.length < 1){this.messageEvent.emit(false); }
      return true;
    }
    return false;
  }
  public lightOrDark(color) {
    this.labelStoreService.lightOrDark(color);
  }

  private getLabelsToAdd(): Array<string> {
    const add: Array<string> = [];
    this.selectedLabels.forEach(selLabel => {
      let found = false;
      this.currentIssue.node.labels.nodes.forEach(label => {
        if (label.id === selLabel) {
          found = true;
        }

      });
      if (!found) {
        add.push(selLabel);
      }
    });

    return add;
  }
  private getLabelsToRemove(): Array<string> {
    const remove: Array<string> = [];
    this.currentIssue.node.labels.nodes.forEach(element => {
      if (!this.selectedLabels.includes(element.id)) {
        remove.push(element.id);
      }
    });

    return remove;
  }
  private removeLabelsFromIssue(removeList: Array<string>){
    removeList.forEach(element2 => {
      const input: RemoveLabelFromIssueInput = {
        issue: this.currentIssue.node.id,
        label: element2
      };
      this.labelStoreService.removeLabel(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      }, (error) => {
        console.log('there was an error sending the query', error); });

    });
  }
  private addLabelsToIssue(addList: Array<string>){
    addList.forEach(element1 => {
      const input: AddLabelToIssueInput = {
        issue: this.currentIssue.node.id,
        label: element1
      };
      this.labelStoreService.addLabel(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      });

    });
  }
  private getIssuesToAdd(): Array<string>{
    const add: Array<string> = [];
    this.selectedIssues.forEach(selIssue => {
      let found = false;
      this.currentIssue.node.linksToIssues.nodes.forEach(issue => {
        if (issue.id === selIssue) {
          found = true;
        }

      });
      if (!found) {
        add.push(selIssue);
      }
    });
    return add;
  }
  private getIssuesToRemove(): Array<string>{
    const remove: Array<string> = [];
    this.currentIssue.node.linksToIssues.nodes.forEach(issue => {
      if (!this.selectedIssues.includes(issue.id)) {
        remove.push(issue.id);
      }
    });

    return remove;
  }
  private linkIssues(issuesToAdd: Array<string>){
    issuesToAdd.forEach(element1 => {
      const input: LinkIssueInput = {
        issue: this.currentIssue.node.id,
        issueToLink: element1
      };
      this.issueStoreService.link(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      });

    });
  }
  private unlinkIssues(issuesToRemove: Array<string>){
    issuesToRemove.forEach(issueToUnlink => {
      const input: UnlinkIssueInput = {
        issue: this.currentIssue.node.id,
        issueToUnlink
      };
      this.issueStoreService.unlink(input).subscribe(data => {
        console.log(data);
        this.messageEvent.emit(true);

      }, (error) => {
        console.log('there was an error sending the query', error); });

    });
  }
  private prepareLinkableIssues() {
    this. projectStoreService.getFullProject(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(project => {
      const projectComponents = project.node.components.edges;
      projectComponents.forEach(component => {
        const currentComponentName = component.node.name;
        const currentComponentIssueArray = component.node.issues.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {id: issue.id,
                            title: issue.title,
                            component: currentComponentName};
          this.linkableProjectIssues.push(tempIssue);
        });
      });
      // All Interfaces
      const projectInterfaces = project.node.interfaces.nodes;
      projectInterfaces.forEach(projectInterface => {
        const currentInterfaceName = projectInterface.name;
        const currentComponentIssueArray = projectInterface.issuesOnLocation.nodes;
        currentComponentIssueArray.forEach(issue => {
          const tempIssue = {id: issue.id,
                            title: issue.title,
                            component: 'Interface: ' + currentInterfaceName};
          this.linkableProjectIssues.push(tempIssue);
        });
      });
      this.currentIssue.node.linksToIssues.nodes.forEach(linkedIssue=>{
        this.selectedIssues.push(linkedIssue.id);
      })

      this.issuesLoaded = true;
    });
  }
}
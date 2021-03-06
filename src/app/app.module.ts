import {BrowserModule} from '@angular/platform-browser';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {ProjectListComponent} from './project-list-component/project-list.component';
import {ProjectOverviewComponent} from './project-overview/project-overview.component';
import {TopToolbarComponent} from './top-toolbar/top-toolbar.component';
import {SideNavComponent} from './side-nav/side-nav.component';
import {GraphQLModule} from './graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {IssueDetailComponent} from './issue-detail/issue-detail.component';
import {GraphsModule} from './graphs/graphs.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NZ_ICONS} from 'ng-zorro-antd/icon';
import {NZ_I18N, en_US} from 'ng-zorro-antd/i18n';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {IconDefinition} from '@ant-design/icons-angular';
import {CommonModule, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {LoginComponent} from './login/login.component';
import {FrameComponent} from './frame/frame.component';
import {RegisterComponent} from './register/register.component';
import {CreateProjectDialogComponent} from 'src/app/dialogs/create-project-dialog/create-project-dialog.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {GlobalConfig, ToastrModule} from 'ngx-toastr';
import {RemoveDialogComponent} from './dialogs/remove-dialog/remove-dialog.component';
import {CreateComponentDialogComponent} from './dialogs/create-component-dialog/create-component-dialog.component';
import {CreateInterfaceDialogComponent} from './dialogs/create-interface-dialog/create-interface-dialog.component';
import {ComponentDetailsComponent} from './component-details/component-details.component';
import {CreateIssueDialogComponent} from './dialogs/create-issue-dialog/create-issue-dialog.component';
import {IssueListComponent} from './issue-list/issue-list.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgOptionHighlightModule} from '@ng-select/ng-option-highlight';
import {ColorPickerModule} from 'ngx-color-picker';
import {InterfaceDetailsComponent} from './interface-details/interface-details.component';
import {IssueSettingsContainerComponent} from './issue-settings-container/issue-settings-container.component';
import {ProjectIssueListComponent} from './project-issue-list/project-issue-list.component';
import {ProjectMembersComponent} from './project-members/project-members.component';
import {LabelSelectorComponent} from '@app/label-selector/label-selector.component';
import {CreateLabelDialogComponent} from '@app/dialogs/create-label-dialog/create-label-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RemoveProjectMemberComponentComponent } from './dialogs/remove-project-member-component/remove-project-member-component.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

// configuration for toasts, the toastrservice is configured in graphql.module.ts
const toasterConfig: Partial<GlobalConfig> = {
  maxOpened: 1,
  autoDismiss: true
};

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    ProjectOverviewComponent,
    TopToolbarComponent,
    SideNavComponent,
    IssueDetailComponent,
    LoginComponent,
    FrameComponent,
    RegisterComponent,
    CreateProjectDialogComponent,
    RemoveDialogComponent,
    CreateComponentDialogComponent,
    CreateInterfaceDialogComponent,
    CreateIssueDialogComponent,
    IssueSettingsContainerComponent,
    LabelSelectorComponent,
    CreateLabelDialogComponent,
    RemoveProjectMemberComponentComponent
  ],
  imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(toasterConfig),
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatTabsModule,
        MatSlideToggleModule,
        GraphQLModule,
        HttpClientModule,
        GraphsModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        NgSelectModule,
        CommonModule,
        NgOptionHighlightModule,
        ColorPickerModule,
        MatExpansionModule,
        MatProgressSpinnerModule
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [{provide: NZ_I18N, useValue: en_US}, {provide: NZ_ICONS, useValue: icons}],
  bootstrap: [AppComponent]
})
export class AppModule {
}

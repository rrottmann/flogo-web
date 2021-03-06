import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FlogoNavbarComponent } from './navbar/navbar.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ContribInstallerModule } from '@flogo-web/lib-client/contrib-installer';
import { ModalModule } from '@flogo-web/lib-client/modal';

@NgModule({
  declarations: [FlogoNavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    OverlayModule,
    PortalModule,
    TranslateModule,
    ContribInstallerModule,
    ModalModule,
  ],
  exports: [FlogoNavbarComponent],
})
export class CoreModule {}

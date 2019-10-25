import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule, MatRippleModule, MatButtonModule, MatTabsModule } from '@angular/material';
import { PttTabsComponent } from './ptt-tabs/ptt-tabs.component';
import {
  PttInkBarDirective,
  // PttTabLinkDirective,
  PttTabNavComponent
} from './tab-nav-bar';

const EXPORTS = [
  PttTabsComponent,
  PttInkBarDirective,
  PttTabNavComponent, // PttTabLinkDirective
];

@NgModule({
  declarations: [
    ...EXPORTS
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRippleModule,
    FormsModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports: [...EXPORTS]
})
export class PttTabsModule { }

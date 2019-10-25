import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptt-ptt-tabs',
  templateUrl: './ptt-tabs.component.html',
  styleUrls: ['./ptt-tabs.component.scss']
})
export class PttTabsComponent implements OnInit {
  links = ['First', 'Second', 'Third'];
  positions = ['left', 'right', 'bottom', 'top'];
  inkPosition = 'bottom';
  activeLink = this.links[0];
  background = '';

  ngOnInit() {}

  toggleBackground() {
    this.background = this.background ? '' : 'primary';
  }

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

}

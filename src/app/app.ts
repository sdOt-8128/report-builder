import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbar,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatNavList,
    MatListItem,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  sidenavOpened = true;
}

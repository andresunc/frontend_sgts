import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent {

  @Input() titulo: string = '';

  constructor(private dataShared: DataSharedService, private authService: AuthService) {} 
  
  handleLogout() {
    this.authService.logout();
    this.dataShared.triggerControlAccess();
  }
  
}

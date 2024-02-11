import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent {

  @Input() titulo: string = '';
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {} 
  
  handleLogout() {
    this.logout.emit();
    console.log('Logout realizado desde TitleBarComponent');
    this.router.navigate(['/login']);
  }
  
}

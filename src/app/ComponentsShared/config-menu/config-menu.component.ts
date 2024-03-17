import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-config-menu',
  templateUrl: './config-menu.component.html',
  styleUrls: ['./config-menu.component.css']
})
export class ConfigMenuComponent {


  @HostListener('window:resize')
  onResize() {
    const menuTitle = document.getElementById('menuTitle') as HTMLElement; 
    const mobileTitle = document.querySelector('.mobile-title') as HTMLElement; 
    
    if (menuTitle && mobileTitle) { 
      if (window.innerWidth <= 768) {
        menuTitle.style.display = 'none'; 
        mobileTitle.style.display = 'block';
      } else {
        menuTitle.style.display = 'block';
        mobileTitle.style.display = 'none'; 
      }
    }
  }
}

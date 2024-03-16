import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-cfg-servicios',
  templateUrl: './cfg-servicios.component.html',
  styleUrls: ['./cfg-servicios.component.css']
})
export class CfgServiciosComponent {

  title: string = "Configuración de Tipos de Servicio";

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

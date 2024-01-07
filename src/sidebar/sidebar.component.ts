import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  /**
   * Este array simula valores que podemos traer de la db para almacenarlos en la LS del usuario, de esta manera vamos a poder implementar una lógica que nos acomode los botones automáticamente.
   */
  botones = [
    { nombre: 'Presupuestados' },
    { nombre: 'Finalizados' },
    { nombre: '+' }
  ];

}

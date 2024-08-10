import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ItemChecklist } from 'src/app/models/DomainModels/ItemChecklist';
import { ItemChecklistService } from 'src/app/services/DomainServices/item-checklist.service';

@Component({
  selector: 'app-reasignacion',
  templateUrl: './reasignacion.component.html',
  styleUrls: ['./reasignacion.component.css']
})
export class ReasignacionComponent implements OnInit {

  items: ItemChecklist[] = [];
  
  constructor(private itemChecklistService: ItemChecklistService) {}

  ngOnInit(): void {
    this.onResponsableSeleccionado(19);
  }

  onResponsableSeleccionado(recursoGgId: number) {
    this.itemChecklistService.getItemsByRecursoGgId(recursoGgId)
      .subscribe(
        (items: ItemChecklist[]) => {
          this.items = items;
          console.log('items para el id 19: ', this.items)
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          // mostrar un mensaje de error
        }
      );
  }
  
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionListComponent } from '../action-list/action-list.component';
import { Subject, takeUntil } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  title: string = "Sección De Reportes";

  constructor(public dialog: MatDialog,
    private dataShared: DataSharedService) { }

  ngOnInit(): void {
    
  }

  openRptList() {
    this.dialog.open(ActionListComponent);
  }

  // Desuscribirse de los observables al destruirse el componente. Evitar probelmas de memoria.
  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
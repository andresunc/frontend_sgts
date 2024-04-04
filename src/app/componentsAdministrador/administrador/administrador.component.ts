import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigMenuComponent } from 'src/app/componentsShared/config-menu/config-menu.component';
import { Subject, takeUntil } from 'rxjs';
import { DataSharedService } from 'src/app/services/data-shared.service';



@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {

  title: string = "Configuración General";
  constructor(public dialog: MatDialog,
    private dataShared: DataSharedService) { }

  ngOnInit(): void {
    this.dataShared.getListreports().pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.openRptList();
    });
  }

  openRptList() {
    this.dialog.open(ConfigMenuComponent);
  }

  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
}

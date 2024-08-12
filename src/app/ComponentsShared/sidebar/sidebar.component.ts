import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; //servicio que permite la navegación entre vistas o componentes en una aplicación Angular.
import { Estado } from 'src/app/models/DomainModels/Estado';
import { Categoria } from 'src/app/models/DomainModels/Categoria';
import { TipoServicio } from 'src/app/models/DomainModels/TipoServicio';
import { AuthService } from 'src/app/services/auth.service';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { PreferenciasService } from 'src/app/services/preferencias.service';
import { ConfigMenuComponent } from '../config-menu/config-menu.component';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { adminMenuTitle, adminMenuItems } from 'src/app/componentsAdministrador/administradorcfg/adminMenuItems';
import { ReportesComponent } from 'src/app/componentsReportes/reportes-pag-home/reportes.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

  listEstados: Estado[] = [];
  tipoServicios: TipoServicio[] = [];
  categorias: Categoria [] = [];
  shouldShowSidebar: boolean = true;
  canAddServicio: boolean;

  constructor(
    private router: Router,
    private preference: PreferenciasService,
    private dataShared: DataSharedService,
    private dialog: MatDialog,
    private authService: AuthService,
    private _snackBar: PopupService,
  ) {
    this.canAddServicio = this.authService.isAdmin();
  }

  ngOnInit(): void {
    console.log('SideBar ON')
    // Verifica la ruta actual y decide si mostrar la barra lateral
    this.shouldShowSidebar = this.router.url !== '/login';

    this.setParameters();

    // cargar setParameters para ser llamado desde otros lados por medio de Servicio
    this.dataShared.getUpDateSideBar().subscribe(() => {
      this.setParameters();
    });

  }

  setParameters() {
    // Cargo los "Estados No Eliminados" de los servicios
    this.preference.getStatusNotDeleted().subscribe((data) => {
      console.log('Estados cargados OK')
      this.listEstados = data;
    });

    // Cargo los "Tipos de Servicios No Eliminados"
    this.preference.getTipoServicesNotDeleted().subscribe((data) => {
      console.log('Tipo de servicios cargados OK')
      this.tipoServicios = data;
    });

    this.preference.getAllCategorias().subscribe((data) => {
      console.log('Categorias cargadas OK')
      this.categorias = data;
    });
  }

  

  // Función para agregar o quitar Estados[] a filtrar.
  selectedStatusToFilter: string[] = [];
  sendStatus(status: string) {

    /* 
    1 Devolver el índice de la primera aparición de <status> en el array. indexOf(status);
    2 Si <status> no está presente, indexOf(status) devuelve -1: Agregar x al array. push(status);
    3 Sino quitarlo. splice(index, 1), donde index es el índice de <status> en el array 
    y 1 es la cantidad de elementos a eliminar.
    */
    const index = this.selectedStatusToFilter.indexOf(status);

    if (index === -1) {
      this.selectedStatusToFilter.push(status);
      this.dataShared.setSharedEstado(this.selectedStatusToFilter);
      this.dataShared.triggerFilterByCheckbox();
    }
    else {
      this.selectedStatusToFilter.splice(index, 1)
      this.dataShared.setSharedEstado(this.selectedStatusToFilter);
      this.dataShared.triggerFilterByCheckbox();
    }
  }

  // Función para agregar o quitar TipoServicio[] a filtrar.
  selectedTipoServicioToFilter: string[] = [];
  sendTipoServicio(tipoServicio: any) {

    const index = this.selectedTipoServicioToFilter.indexOf(tipoServicio);

    if (index === -1) {
      this.selectedTipoServicioToFilter.push(tipoServicio);
      this.dataShared.setSharedTipoServicio(this.selectedTipoServicioToFilter);
      this.dataShared.triggerFilterByCheckbox();
    }
    else {
      this.selectedTipoServicioToFilter.splice(index, 1)
      this.dataShared.setSharedTipoServicio(this.selectedTipoServicioToFilter);
      this.dataShared.triggerFilterByCheckbox();
    }
  }

  selectedCategoriaToFilter: string[] = [];
  sendCategoria(categoria: any) {

    const index = this.selectedCategoriaToFilter.indexOf(categoria);

    if (index === -1) {
      this.selectedCategoriaToFilter.push(categoria);
      this.dataShared.setSharedCategoria(this.selectedCategoriaToFilter);
      this.dataShared.triggerFilterByCheckbox();
    }
    else {
      this.selectedCategoriaToFilter.splice(index, 1)
      this.dataShared.setSharedCategoria(this.selectedCategoriaToFilter);
      this.dataShared.triggerFilterByCheckbox();
    }
  }

}


function ngOnInit() {
  throw new Error('Function not implemented.');
}


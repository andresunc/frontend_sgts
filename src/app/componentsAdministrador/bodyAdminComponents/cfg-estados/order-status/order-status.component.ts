import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/models/DomainModels/Categoria';
import { Estado } from 'src/app/models/DomainModels/Estado';
import { Params } from 'src/app/models/Params';
import { CategoriaService } from 'src/app/services/DomainServices/categoria.service';
import { EstadosService } from 'src/app/services/DomainServices/estados.service';
import { PopupService } from 'src/app/services/SupportServices/popup.service';
import { DataSharedService } from 'src/app/services/data-shared.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent {

  estados: Estado[] = [];
  sinIniciar: Estado[] = [];
  enCurso: Estado[] = [];
  finalizado: Estado[] = [];
  idSinIniciar: number | undefined = 0;
  idEnCurso: number | undefined = 0;
  idFinalizado: number | undefined = 0;
  cargandoEstados = false; // Inicia la carga
  cargandoCategorias = false; // Inicia la carga
  params: Params = new Params();

  categorias: Categoria[] = [];

  constructor(
    private estadosService: EstadosService, 
    private categoriaService: CategoriaService,
    private _snackBar: PopupService,
    private dataShared: DataSharedService,
    public dialogRef: MatDialogRef<OrderStatusComponent>) { }

  ngOnInit() {
    this.obtenerEstado();
    this.obtenerCategorias();
    this.dataShared.mostrarSpinner();
  }

  obtenerEstado() {
    this.cargandoEstados = true
    this.estadosService.getStatusNotDeleted().subscribe((data: Estado[]) => {
      this.estados = data;
      this.cargandoEstados = false
      console.log("Estados obtenidos:", this.estados);
    }).add(
      ()=> {
        this.closeSpinner()
      }
    );
  }

  obtenerCategorias() {
    this.cargandoCategorias = true; // Inicia la carga
    this.categoriaService.getAllCategorias().subscribe(
      (data: Categoria[]) => {
        this.cargandoCategorias = false; // Inicia la carga
        this.categorias = data;
        this.idSinIniciar = this.categorias.find(cat => cat.categoria === this.params.SIN_INICIAR)?.idCategoria;
        this.idEnCurso = this.categorias.find(cat => cat.categoria === this.params.EN_CURSO)?.idCategoria;
        this.idFinalizado = this.categorias.find(cat => cat.categoria === this.params.FINALIZADO)?.idCategoria;
        this.cargarEstadosEnCategorias();
        console.log('Categorias cargadas: ', this.idSinIniciar, this.idEnCurso, this.idFinalizado);
      }
    ).add(
      ()=> {
        this.closeSpinner()
      }
    );;
  }

  closeSpinner() {
    if (!this.cargandoCategorias && !this.cargandoEstados) {
      this.dataShared.ocultarSpinner();
    }
  }

  cargarEstadosEnCategorias() {
    this.estados.forEach(estado => {
      switch (estado.idCategoria) {
        case this.idSinIniciar:
          this.sinIniciar.push(estado);
          break;
        case this.idEnCurso:
          this.enCurso.push(estado);
          break;
        case this.idFinalizado:
          this.finalizado.push(estado);
          break;
        default:
          console.error('Categoría no reconocida para el estado: ', estado);
          break;
      }
    });
  }

  drop(event: CdkDragDrop<Estado[]>, estado: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Actualizar el estado de los elementos según la categoría en la que se encuentren
    this.actualizarCategorias();
    // Actualizar el número de orden después de que el usuario realice el orden
    this.actualizarNumerosDeOrden();
    // Imprimir el listado de estados actualizado
    this.actualizarEstados();
  }

  actualizarCategorias() {
    this.estados.forEach(estado => {
      if (this.sinIniciar.includes(estado)) {
        estado.idCategoria = 1;
      } else if (this.enCurso.includes(estado)) {
        estado.idCategoria = 2;
      } else if (this.finalizado.includes(estado)) {
        estado.idCategoria = 3;
      }
    });
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  actualizarNumerosDeOrden() {
    // Actualizar el número de orden para cada estado en la lista sinIniciar
    this.sinIniciar.forEach((estado, index) => {
      estado.orden = index;
    });
    // Actualizar el número de orden para cada estado en la lista enCurso
    this.enCurso.forEach((estado, index) => {
      estado.orden = this.sinIniciar.length + index;
    });
    // Actualizar el número de orden para cada estado en la lista finalizado
    this.finalizado.forEach((estado, index) => {
      estado.orden = this.sinIniciar.length + this.enCurso.length + index;
    });
    // Reordenar los elementos dentro de cada lista según su número de orden
    this.sinIniciar.sort((a, b) => (a.orden && b.orden) ? a.orden - b.orden : 0);
    this.enCurso.sort((a, b) => (a.orden && b.orden) ? a.orden - b.orden : 0);
    this.finalizado.sort((a, b) => (a.orden && b.orden) ? a.orden - b.orden : 0);
  }

  actualizarEstados() {
    // Limpiar la lista 'this.estados'
    this.estados = [];
    // Agregar los elementos de las tres listas a 'this.estados'
    this.estados.push(...this.sinIniciar, ...this.enCurso, ...this.finalizado);
    console.log('Lista de estados actualizada:', this.estados);
  }

  stopOrden: boolean = false;
  updateOrdenEstados() {
    this.dataShared.mostrarSpinner();
    this.stopOrden = true;
    this.estadosService.updateEstadoOrden(this.estados)
    .subscribe(
      (data) => {
        console.log('Actualización orden estados Data: ', data);
        this.dialogRef.close(); // Cierra el diálogo
        this._snackBar.okSnackBar('Orden actualizado')
      }
    ).add(
      () => {
        this.dataShared.ocultarSpinner();
        this.stopOrden = false;
      }
    )
  }
  
}

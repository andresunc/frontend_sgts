import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RiesgoService } from 'src/app/services/DomainServices/riesgo.service';
import { Riesgo } from 'src/app/models/DomainModels/Riesgo';
import { EmpresaDto } from 'src/app/models/ModelsDto/EmpresaDto';
import { EmpresaDtoService } from 'src/app/services/ServiciosDto/empresa-dto.service';
import { RubroService } from 'src/app/services/DomainServices/rubro.service';
import { Rubro } from 'src/app/models/DomainModels/Rubro';
import { EmpresaService } from 'src/app/services/DomainServices/empresa.service';
import { Empresa } from 'src/app/models/DomainModels/Empresa';
import { ContactoEmpesa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { DataSharedService } from 'src/app/services/data-shared.service';



@Component({
  selector: 'app-cfg-clientes',
  templateUrl: './cfg-clientes.component.html',
  styleUrls: ['./cfg-clientes.component.css']
})
export class CfgClientesComponent implements OnInit {

  title: string = "Configuración de Clientes";
  riesgos: Riesgo[] = [];
  rubros: Rubro[] = [];
  myControl = new FormControl();
  empresas: EmpresaDto[] = [];
  filteredOptions?: Observable<EmpresaDto[]>;
  displayFn!: ((value: any) => string);
  rubroControl = new FormControl();
  filteredRubros?: Observable<Rubro[]>;
  riesgoControl = new FormControl();
  filteredRiesgos?: Observable<Riesgo[]>;
  secondFormGroup: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
  modificarEliminarHabilitado: boolean = false;
  resumenDatos: any = {};
  contactos: ContactoEmpesa[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private riesgoService: RiesgoService,
    private rubroService: RubroService,
    private empresaDtoService: EmpresaDtoService,
    private empresaService: EmpresaService,
    private dataShared: DataSharedService
  ) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical' as StepperOrientation)));

    // Inicializar secondFormGroup en el constructor
    this.secondFormGroup = this._formBuilder.group({
      Nombre: ['', [Validators.required]],
      Apellido: [''],
      Telefono: ['', [Validators.required, Validators.pattern('^[0-9]{6,}$')]],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]]
    });
  }

  firstFormGroup = this._formBuilder.group({
    BuscarCliente: [''],
    RazonSocial: ['', [Validators.required]],
    CUIT: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d$/)]],
    Direccion: ['', [Validators.required]],

  });


  getStepperStyles() {
    return {
      'width.%': this.stepperOrientation.pipe(map(orientation => orientation === 'horizontal' ? 100 : 80)),
      'height.px': this.stepperOrientation.pipe(map(orientation => orientation === 'horizontal' ? 80 : 100))
    };
  }

  ngOnInit() {
    // Agregar el campo de correo electrónico a secondFormGroup
    this.secondFormGroup.addControl('Email', this._formBuilder.control('', [Validators.required, Validators.email]));

    this.actualizarResumen();

    this.obtenerRiesgo();

    this.obtenerRubro();

    this.obtenerEmpresa();


    // Configurar el filtro para el campo de búsqueda:
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.myControl.valueChanges.subscribe(() => {
      if (!this.myControl.value) {
        this.myControl.setValue('');
      }
    });


    this.filteredRubros = this.rubroControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRubros(value))
    );

    this.filteredRiesgos = this.riesgoControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRiesgos(value))
    );

    this.firstFormGroup.get('CUIT')?.valueChanges.subscribe((value: string | null) => {
      // Verificar si el valor tiene 2, 10 y 11 caracteres respectivamente
      if (value !== null && (value.length === 2 || value.length === 11)) {
        // Agregar guiones en las posiciones adecuadas
        this.firstFormGroup.get('CUIT')?.patchValue(value + '-', { emitEvent: false });
      }
    });

  }

  obtenerRiesgo() {

    this.riesgoService.getAllRiesgo().subscribe((data: Riesgo[]) => {
      this.riesgos = data;
      console.log("Riesgos obtenidos:", this.riesgos);
    });
  }

  obtenerRubro() {

    this.rubroService.getAllRubro().subscribe((data: Rubro[]) => {
      this.rubros = data;
      console.log("Rubros obtenidos:", this.rubros);
    });
  }


  obtenerEmpresa() {
    this.empresaDtoService.getEmpresas().subscribe((data: EmpresaDto[]) => {
      this.empresas = data;
    });


  }

  // Función para actualizar el objeto del resumen
  actualizarResumen() {
    this.resumenDatos.datosCliente = {
      RazonSocial: this.firstFormGroup.get('RazonSocial')?.value,
      CUIT: this.firstFormGroup.get('CUIT')?.value,
      Direccion: this.firstFormGroup.get('Direccion')?.value,
      Rubro: this.firstFormGroup.get('Rubro')?.value,
      Riesgo: this.firstFormGroup.get('Riesgo')?.value
    };

    this.resumenDatos.contactos = this.contactos;

  }

  agregarContacto() {
    if (this.secondFormGroup.valid) {
      const nombre = this.secondFormGroup.get('Nombre')?.value;
      const apellido = this.secondFormGroup.get('Apellido')?.value;
      const telefono = this.secondFormGroup.get('Telefono')?.value;
      const email = this.secondFormGroup.get('Email')?.value;

      // Agregar los datos a la lista de contactos
      this.contactos.push({

        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        email: email
      });

      this.secondFormGroup.reset();

      // Actualizar el resumen después de agregar el contacto
      this.actualizarResumen();
    }
  }

  editarContacto(contacto: any) {
    // Autocompletar los campos del formulario con los datos del contacto
    this.secondFormGroup.patchValue({
      Nombre: contacto.nombre,
      Apellido: contacto.apellido,
      Telefono: contacto.telefono,
      Email: contacto.email
    });

    // Eliminar el contacto de la lista
    const index = this.contactos.indexOf(contacto);
    if (index !== -1) {
      this.contactos.splice(index, 1);
    }

    this.actualizarResumen();
  }


  paso1EsValido(): boolean {
    const rubroSeleccionado = this.rubros.find(rubro => rubro.rubro === this.rubroControl.value);
    const riesgoSeleccionado = this.riesgos.find(riesgo => riesgo.riesgo === this.riesgoControl.value);

    return (
      this.firstFormGroup.valid &&
      rubroSeleccionado !== undefined &&
      riesgoSeleccionado !== undefined
    );
  }


  cargarDatosClienteSeleccionado(clienteSeleccionado: any) {
    // Cargar los datos del cliente en los campos del primer paso del formulario
    this.firstFormGroup.patchValue({
      RazonSocial: clienteSeleccionado.razonSocial,
      CUIT: clienteSeleccionado.cuit,
      // Otras propiedades del cliente
    });

    // Cargar los contactos del cliente en el paso 2 del formulario
    this.contactos = clienteSeleccionado.contactos;
  }

  crearCliente() {
    this.dataShared.mostrarSpinner();

    const razonSocial = this.firstFormGroup.get('RazonSocial')?.value;
    const cuit = this.firstFormGroup.get('CUIT')?.value;
    const direccion = this.firstFormGroup.get('Direccion')?.value;
    const rubro = this.firstFormGroup.get('Rubro')?.value;
    const riesgo = this.firstFormGroup.get('Riesgo')?.value;

    const empresa: Empresa = new Empresa();
    empresa.cuit = cuit;
    empresa.direccion = direccion;
    empresa.rubroIdRubro = Number(rubro);
    empresa.riesgoIdRiesgo = Number(riesgo);
    empresa.razonSocial = razonSocial;


    this.empresaService.addEmpresa(empresa).subscribe(
      (response: Empresa) => {
        let idEmpresa: any = response.idEmpresa
        this.contactos.forEach(contacto => contacto.empresaIdEmpresa = idEmpresa)
      }
    )


    this.dataShared.ocultarSpinner();//debe ser la ultima linea
    //hacer que vuelva al step 1 reset todo el formulario
  }

  modificarCliente() {
    // Lógica para modificar el cliente en la base de datos
  }


  eliminarCliente() {
    // Lógica para eliminar el cliente de la base de datos
  }


  buscarCliente() {
    // Lógica para buscar el cliente y cargar los datos

    // Verificar si se ha seleccionado un cliente
    const clienteSeleccionado = this.firstFormGroup.get('BuscarCliente')?.value;

    // Si se ha seleccionado un cliente, habilitar los botones Modificar y Eliminar
    if (clienteSeleccionado) {
      this.modificarEliminarHabilitado = true;
    } else {
      // Si no se ha seleccionado un cliente, deshabilitar los botones Modificar y Eliminar
      this.modificarEliminarHabilitado = false;
    }

  }

  onInputChange() {
    // Verificar si se han ingresado datos manualmente
    if (this.firstFormGroup.dirty || this.modificarEliminarHabilitado) {
      // Habilitar el botón Modificar y Eliminar
      this.modificarEliminarHabilitado = true;
    } else {
      // Deshabilitar el botón Modificar y Eliminar
      this.modificarEliminarHabilitado = false;
    }
  }

  private _filter(value: string): EmpresaDto[] {
    const filterValue = value.toLowerCase();
    return this.empresas.filter(empresa => empresa.cliente?.toLowerCase().startsWith(filterValue));
  }

  private _filterRubros(value: string): Rubro[] {
    const filterValue = value.toLowerCase();
    return this.rubros.filter(rubro => rubro.rubro?.toLowerCase().startsWith(filterValue));
  }

  private _filterRiesgos(value: string): Riesgo[] {
    const filterValue = value.toLowerCase();
    return this.riesgos.filter(riesgo => riesgo.riesgo?.toLowerCase().startsWith(filterValue));
  }

}


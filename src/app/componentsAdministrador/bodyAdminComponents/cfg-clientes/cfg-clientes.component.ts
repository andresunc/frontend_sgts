import { Component, OnInit} from '@angular/core';
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
import { ContactoEmpresa } from 'src/app/models/DomainModels/ContactoEmpresa';
import { DataSharedService } from 'src/app/services/data-shared.service';
import { ContactoEmpresaService } from 'src/app/services/DomainServices/contacto-empresa.service';
import { EmpresaWithContacts } from 'src/app/models/ModelsDto/EmpresaWithContacts';

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
  secondFormGroup: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
  modificarEliminarHabilitado: boolean = false;
  resumenDatos: any = {};
  contactos: ContactoEmpresa[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private riesgoService: RiesgoService,
    private rubroService: RubroService,
    private empresaDtoService: EmpresaDtoService,
    private empresaService: EmpresaService,
    private dataShared: DataSharedService,
    private contactoEmpresaService: ContactoEmpresaService
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
  firstFormGroup = new FormGroup({
    BuscarCliente: new FormControl<string>(''),
    RazonSocial: new FormControl<string>('', Validators.required),
    CUIT: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d$/)]),
    Direccion: new FormControl<string>(''),
    Rubro: new FormControl<Rubro>(new Rubro, Validators.required),
    Riesgo: new FormControl<Riesgo>(new Riesgo, Validators.required),
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

    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value ? this._filter(value) : this.empresas.slice();
      })
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
    return (
      this.firstFormGroup.valid
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
    const rubro = this.firstFormGroup.controls.Rubro;
    const riesgo = this.firstFormGroup.controls.Riesgo;

    const empresa: Empresa = new Empresa();
    empresa.cuit = cuit;
    empresa.direccion = direccion;
    empresa.rubroIdRubro = rubro.value?.idRubro;
    empresa.riesgoIdRiesgo = riesgo.value?.idRiesgo;
    empresa.razonSocial = razonSocial;

    const empresaWithContacts: EmpresaWithContacts = new EmpresaWithContacts();
    empresaWithContacts.empresa = empresa;
    empresaWithContacts.contactos = this.contactos;

    this.empresaService.addEmpresaWithContacts(empresaWithContacts)
    .subscribe(
      (data) => {
        console.log('Empresa creada: ', data)
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

}


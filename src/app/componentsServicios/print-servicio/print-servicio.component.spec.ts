import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintServicioComponent } from './print-servicio.component';

describe('PrintServicioComponent', () => {
  let component: PrintServicioComponent;
  let fixture: ComponentFixture<PrintServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

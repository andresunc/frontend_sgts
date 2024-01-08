import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServicioComponent } from './new-servicio.component';

describe('NewServicioComponent', () => {
  let component: NewServicioComponent;
  let fixture: ComponentFixture<NewServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewServicioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

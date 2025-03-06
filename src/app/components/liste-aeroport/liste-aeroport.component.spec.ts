import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAeroportComponent } from './liste-aeroport.component';

describe('ListeAeroportComponent', () => {
  let component: ListeAeroportComponent;
  let fixture: ComponentFixture<ListeAeroportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListeAeroportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeAeroportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

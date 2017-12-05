import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FlogoApplicationSearchComponent } from './search.component';
import { NoDependenciesFakeLanguageModule } from '@flogo/core/language/testing';

describe('FlogoApplicationSearchComponent component', () => {
  let comp: FlogoApplicationSearchComponent;
  let fixture: ComponentFixture<FlogoApplicationSearchComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  function compileComponent() {
    return TestBed.compileComponents();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoDependenciesFakeLanguageModule],
      declarations: [FlogoApplicationSearchComponent] // declare the test component
    });
  });

  it('On key press should emit the changedSearch event', done => {
    compileComponent()
      .then(() => {
        fixture = TestBed.createComponent(FlogoApplicationSearchComponent);
        comp = fixture.componentInstance;

        comp.changedSearch.subscribe(() => {
          done();
        });

        fixture.detectChanges();
        de = fixture.debugElement.query(By.css('input'));
        el = de.nativeElement;
        const event = new Event('keyup');
        el.dispatchEvent(event);
      });
  });

});

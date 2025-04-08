import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomFeedComponent } from './random-feed.component';

describe('RandomFeedComponent', () => {
  let component: RandomFeedComponent;
  let fixture: ComponentFixture<RandomFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

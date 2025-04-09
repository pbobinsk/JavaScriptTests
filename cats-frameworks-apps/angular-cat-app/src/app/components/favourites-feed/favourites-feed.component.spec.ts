import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesFeedComponent } from './favourites-feed.component';

describe('FavouritesFeedComponent', () => {
  let component: FavouritesFeedComponent;
  let fixture: ComponentFixture<FavouritesFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouritesFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

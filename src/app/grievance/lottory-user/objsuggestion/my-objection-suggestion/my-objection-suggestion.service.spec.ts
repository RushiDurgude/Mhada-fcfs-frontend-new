import { TestBed } from '@angular/core/testing';

import { MyObjectionSuggestionService } from './my-objection-suggestion.service';

describe('MyObjectionSuggestionService', () => {
  let service: MyObjectionSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyObjectionSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

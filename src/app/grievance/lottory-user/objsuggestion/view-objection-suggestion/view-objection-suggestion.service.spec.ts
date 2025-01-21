import { TestBed } from '@angular/core/testing';

import { ViewObjectionSuggestionService } from './view-objection-suggestion.service';

describe('ViewObjectionSuggestionService', () => {
  let service: ViewObjectionSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewObjectionSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CreateObjectionSuggestionService } from './create-objection-suggestion.service';

describe('CreateObjectionSuggestionService', () => {
  let service: CreateObjectionSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateObjectionSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

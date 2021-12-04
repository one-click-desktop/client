import { TestBed } from '@angular/core/testing';

import { RabbitMQService } from './rabbitmq.service';

describe('RabbitmqService', () => {
  let service: RabbitMQService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RabbitMQService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

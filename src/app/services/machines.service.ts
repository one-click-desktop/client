import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Mock service till API is defined, skipping tests

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  constructor() {}

  getAvailableMachines(): Observable<Machine> {
    return of({ cpu: 12, gpu: 0 });
  }
}

interface Machine {
  cpu: number;
  gpu: number;
}

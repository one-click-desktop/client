import { Component, OnInit } from '@angular/core';
import { MachinesService } from '@services/machines.service';
import { setTimeout } from 'timers';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  availableCpu: number = 0;
  availableGpu: number = 0;

  canConnect: boolean = false;
  canRefresh: boolean = false;

  constructor(private machinesService: MachinesService) {}

  ngOnInit(): void {
    this.getAvailableMachines();
  }

  getAvailableMachines(): void {
    this.machinesService
      .getAvailableMachines()
      .subscribe(
        (availableMachines) => {
          this.availableCpu = availableMachines.cpu;
          this.availableGpu = availableMachines.gpu;
        },
        (_) => {
          this.availableCpu = this.availableGpu = 0;
        }
      )
      .add(() => {
        this.canConnect = !!(this.availableCpu || this.availableGpu);
        setTimeout(() => (this.canRefresh = true), 1000);
      });
  }

  refresh(): void {
    this.canRefresh = false;
    this.getAvailableMachines();
  }

  connect(): void {
    //TODO: add implementation
  }
}

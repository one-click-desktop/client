import { Component, OnInit } from '@angular/core';
import { Machines } from '@api-module/model/models';
import { MachinesService } from '@api-module/api/api';
import { ConnectModalComponent } from '@components/connect-modal/connect-modal.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { setTimeout } from 'timers';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  machines: Machines[];

  canConnect: boolean = false;
  canRefresh: boolean = false;

  loaded: boolean = false;

  constructor(
    private machinesService: MachinesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAvailableMachines();
  }

  getAvailableMachines(): void {
    this.loaded = false;
    this.machinesService
      .getMachines()
      .subscribe(
        (availableMachines: Machines[]) => {
          this.machines = availableMachines ?? [];
        },
        (_) => {
          this.machines = [];
        }
      )
      .add(() => {
        this.canConnect =
          this.machines?.some((machine) => machine.amount) ?? false;
        setTimeout(() => (this.canRefresh = true), 1000);
        this.loaded = true;
      });
  }

  refresh(): void {
    this.canRefresh = false;
    this.getAvailableMachines();
  }

  connect(): void {
    const modalRef = this.modalService.open(ConnectModalComponent);
    modalRef.componentInstance.availableTypes = this.machines?.map(
      (machine) => machine.type
    );
  }
}

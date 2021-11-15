import { Component, OnInit } from '@angular/core';

import { timer } from 'rxjs';

import { ConnectModalComponent } from '@components/connect-modal/connect-modal.component';
import { TimeConstants } from '@constants/time-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MachinesService } from '@one-click-desktop/api-module';
import { Machine } from '@one-click-desktop/api-module';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  machines: Machine[];

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
        (availableMachines: Machine[]) => {
          this.machines = availableMachines ?? [];
        },
        (_) => {
          this.machines = [];
        }
      )
      .add(() => {
        this.canConnect =
          this.machines?.some((machine) => machine.amount) ?? false;
        timer(TimeConstants.REFRESH_WAIT_TIME).subscribe(
          () => (this.canRefresh = true)
        );
        this.loaded = true;
      });
  }

  refresh(): void {
    this.canRefresh = false;
    this.getAvailableMachines();
  }

  connect(): void {
    const modalRef = this.modalService.open(ConnectModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
    if (modalRef) {
      modalRef.componentInstance.availableTypes = this.machines
        ?.filter((machine) => machine.amount > 0)
        .map((machine) => machine.type);
    }
  }
}

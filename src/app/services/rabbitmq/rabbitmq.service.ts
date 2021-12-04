import { Injectable } from '@angular/core';

import { ElectronService } from '@services/electron/electron.service';

@Injectable({
  providedIn: 'root',
})
export class RabbitMQService {
  private connection: any;

  constructor(private electronService: ElectronService) {}

  connect(name: string, address: string): void {
    this.electronService.rabbit.connect(address, (error0, connection) => {
      if (error0) {
        throw error0;
      }

      this.connection = connection;

      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }

        channel.assertQueue(
          name,
          {
            exclusive: true,
          },
          function (error2, q) {
            if (error2) {
              throw error2;
            }
            channel.consume(q.queue, () => {}, {
              noAck: true,
            });
          }
        );
      });
    });
  }

  disconnect(): void {
    this.connection?.close();
  }
}

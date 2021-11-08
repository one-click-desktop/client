import { Chance } from 'chance';

import {
  IpAddress,
  MachineType,
  Session,
  SessionStatus,
} from '@one-click-desktop/api-module';

const chance = new Chance();

export interface SessionFixtureParameters {
  id?: string;
  type?: MachineType;
  status?: SessionStatus;
  address?: IpAddress;
}

export function getSessionFixture(
  parameters?: SessionFixtureParameters
): Session {
  return {
    id: parameters?.id || chance.guid(),
    type: parameters?.type || MachineType.Cpu,
    status: parameters?.status || SessionStatus.Pending,
    address: parameters?.address || {
      address: chance.ip(),
      port: chance.normal(),
    },
  };
}

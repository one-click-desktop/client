import { Chance } from 'chance';

import {
  IpAddress,
  Machine,
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
    id: parameters?.id ?? chance.guid(),
    type: parameters?.type ?? getMachineTypeFixture(),
    status: parameters?.status ?? SessionStatus.Pending,
    address: parameters?.address ?? {
      address: chance.ip(),
      port: chance.normal(),
    },
  };
}

export interface MachineTypeFixtureParameters {
  name?: string;
  code?: number;
}

export function getMachineTypeFixture(
  parameters?: MachineTypeFixtureParameters
): MachineType {
  return {
    name: parameters?.name ?? chance.string(),
    code: parameters?.code ?? chance.natural(),
  };
}

export interface MachineFixtureParameters {
  type?: MachineType;
  amount?: number;
}

export function getMachineFixture(
  parameters?: MachineFixtureParameters
): Machine {
  return {
    type: parameters?.type ?? getMachineTypeFixture(),
    amount: parameters?.amount ?? chance.natural(),
  };
}

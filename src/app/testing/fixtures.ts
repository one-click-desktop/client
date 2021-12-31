import { Chance } from 'chance';

import {
  IpAddress,
  Login,
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
    address: parameters?.address ?? getIpAddressFixture(),
  };
}

export interface IpAddressFixtureParameters {
  address?: string;
  port?: number;
}

export function getIpAddressFixture(
  parameters?: IpAddressFixtureParameters
): IpAddress {
  return {
    address: parameters?.address ?? chance.ip(),
    port: parameters?.port ?? chance.normal(),
  };
}

export interface MachineTypeFixtureParameters {
  name?: string;
  code?: string;
}

export function getMachineTypeFixture(
  parameters?: MachineTypeFixtureParameters
): MachineType {
  return {
    name: parameters?.name ?? chance.string(),
    code: parameters?.code ?? chance.string(),
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

export interface LoginFixtureParameters {
  login?: string;
  password?: string;
}

export function getLoginFixture(parameters?: LoginFixtureParameters): Login {
  return {
    login: parameters?.login ?? chance.string(),
    password: parameters?.password ?? chance.string(),
  };
}

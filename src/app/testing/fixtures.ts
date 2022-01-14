import { Chance } from 'chance';

import { Config } from '@models/config';
import {
  IpAddress,
  Login,
  Machine,
  MachineType,
  Session,
  SessionStatus,
} from '@one-click-desktop/api-module';

const chance = new Chance();

export function getSessionFixture(parameters?: Partial<Session>): Session {
  return {
    id: parameters?.id ?? chance.guid(),
    type: parameters?.type ?? getMachineTypeFixture(),
    status: parameters?.status ?? SessionStatus.Pending,
    address: parameters?.address ?? getIpAddressFixture(),
  };
}

export function getIpAddressFixture(
  parameters?: Partial<IpAddress>
): IpAddress {
  return {
    address: parameters?.address ?? chance.ip(),
    port: parameters?.port ?? chance.natural(),
  };
}

export function getMachineTypeFixture(
  parameters?: Partial<MachineType>
): MachineType {
  return {
    name: parameters?.name ?? chance.string(),
    code: parameters?.code ?? chance.string(),
  };
}

export function getMachineFixture(parameters?: Partial<Machine>): Machine {
  return {
    type: parameters?.type ?? getMachineTypeFixture(),
    amount: parameters?.amount ?? chance.natural(),
  };
}

export function getLoginFixture(parameters?: Partial<Login>): Login {
  return {
    login: parameters?.login ?? chance.string(),
    password: parameters?.password ?? chance.string(),
  };
}

export function getConfigFixture(parameters?: Partial<Config>): Config {
  return {
    basePath: parameters?.basePath ?? chance.string(),
    rabbitPath: parameters?.rabbitPath ?? chance.string(),
    useRdpCredentials: parameters?.useRdpCredentials ?? chance.bool(),
    startRdp: parameters?.startRdp ?? chance.bool(),
  };
}

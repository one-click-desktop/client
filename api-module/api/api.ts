export * from './login.service';
import { LoginService } from './login.service';
export * from './machines.service';
import { MachinesService } from './machines.service';
export * from './resources.service';
import { ResourcesService } from './resources.service';
export * from './session.service';
import { SessionService } from './session.service';
export const APIS = [LoginService, MachinesService, ResourcesService, SessionService];

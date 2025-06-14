import { Employee } from "./Employee";

export interface EmployeeRepository {
  listEmployees(filename: string): Employee[];
}

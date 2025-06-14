import { Employee } from "./Employee";
import { OurDate } from "./OurDate";

export interface EmployeeRepository {
  listEmployeesByBirthday(filename: string, ourDate: OurDate): Employee[];
}

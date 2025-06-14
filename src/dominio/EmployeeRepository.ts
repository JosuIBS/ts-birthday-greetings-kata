import { Employee } from "./Employee";
import { OurDate } from "./OurDate";

export interface EmployeeRepository {
  listEmployeesByBirthday(ourDate: OurDate): Employee[];
}

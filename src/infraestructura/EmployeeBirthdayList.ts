import fs from "fs";
import path from "path";
import { Employee } from "src/dominio/Employee";
import { EmployeeRepository } from "src/dominio/EmployeeRepository";
import { OurDate } from "src/dominio/OurDate";

export class FileEmployeeRepository implements EmployeeRepository {
  constructor(private fileName: string) {}
  listEmployeesByBirthday(ourDate: OurDate) {
    const lines = transformTxtToArray(this.fileName);

    return lines
      .map((line) => {
        const employeeData = line.split(", ");
        const employee = new Employee(
          employeeData[1],
          employeeData[0],
          employeeData[2],
          employeeData[3]
        );
        return employee;
      })
      .filter((employee) => employee.isBirthday(ourDate));
  }
}

const transformTxtToArray = (fileName: string) => {
  const dataFromTxt = fs.readFileSync(
    path.resolve(__dirname, `../../resources/${fileName}`),
    "UTF-8"
  );
  // split the contents by new line
  const divideDataToLines = dataFromTxt.split(/\r?\n/);

  divideDataToLines.shift();

  return divideDataToLines;
};

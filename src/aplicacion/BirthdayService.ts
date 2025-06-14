import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { Employee } from "../dominio/Employee";
import { OurDate } from "../dominio/OurDate";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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

export class BirthdayService {
  sendGreetings(
    fileName: string,
    ourDate: OurDate,
    smtpHost: string,
    smtpPort: number
  ) {
    const lines = transformTxtToArray(fileName);
    // print all lines
    lines.forEach((line) => {
      const employeeData = line.split(", ");
      const employee = new Employee(
        employeeData[1],
        employeeData[0],
        employeeData[2],
        employeeData[3]
      );
      this.greetBirthday(employee, ourDate, smtpHost, smtpPort);
    });
  }

  greetBirthday = (
    employee: Employee,
    ourDate: OurDate,
    smtpHost: string,
    smtpPort: number
  ) => {
    if (employee.isBirthday(ourDate)) {
      const recipient = employee.getEmail();
      const body = "Happy Birthday, dear %NAME%!".replace(
        "%NAME%",
        employee.getFirstName()
      );
      const subject = "Happy Birthday!";
      this.sendMessage(
        smtpHost,
        smtpPort,
        "sender@here.com",
        subject,
        body,
        recipient
      );
    }
  };
  async sendMessage(
    smtpHost: string,
    smtpPort: number,
    sender: string,
    subject: string,
    body: string,
    recipient: string
  ) {
    const message = {
      host: smtpHost,
      port: smtpPort,
      from: sender,
      to: [recipient],
      subject,
      text: body,
    };

    this.deliveryMessage(message);
  }

  // made protected for testing :-(
  protected async deliveryMessage({ host, port, ...msg }: Message) {
    const transport = nodemailer.createTransport({ host, port });

    await transport.sendMail(msg);
  }
}

export interface Message extends SMTPTransport.Options, Mail.Options {}

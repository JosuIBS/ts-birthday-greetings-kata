import { Employee } from "../dominio/Employee";
import { OurDate } from "../dominio/OurDate";
import { EmployeeRepository } from "src/dominio/EmployeeRepository";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";

export class BirthdayService {
  constructor(private employeeRepository: EmployeeRepository) {}

  sendGreetings(
    fileName: string,
    ourDate: OurDate,
    smtpHost: string,
    smtpPort: number
  ) {
    const employees = this.employeeRepository.listEmployeesByBirthday(
      fileName,
      ourDate
    );
    // print all lines
    employees.forEach((employee) => {
      this.greetBirthday(employee, ourDate, smtpHost, smtpPort);
    });
  }

  greetBirthday = (
    employee: Employee,
    ourDate: OurDate,
    smtpHost: string,
    smtpPort: number
  ) => {
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

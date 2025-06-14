import { Employee } from "../dominio/Employee";
import { OurDate } from "../dominio/OurDate";
import { EmployeeRepository } from "src/dominio/EmployeeRepository";
import NodeMailerMail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { MailingRepository } from "src/dominio/MailingRepository";
import { Mail } from "src/dominio/Mail";

export class BirthdayService {
  constructor(
    private employeeRepository: EmployeeRepository,
    private mailingRepository: MailingRepository
  ) {}

  sendGreetings(ourDate: OurDate) {
    const employees = this.employeeRepository.listEmployeesByBirthday(ourDate);
    // print all lines
    employees.forEach((employee) => {
      const mail: Mail = {
        recipient: "recipient@here.com",
        body: "Happy Birthday, dear %NAME%!".replace(
          "%NAME%",
          employee.getFirstName()
        ),
        subject: "Happy Birthday!",
        sender: "sender@here.com",
      };
      this.mailingRepository.send(mail);
    });
  }

  greetBirthday = (employee: Employee, smtpHost: string, smtpPort: number) => {
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

export interface Message
  extends SMTPTransport.Options,
    NodeMailerMail.Options {}

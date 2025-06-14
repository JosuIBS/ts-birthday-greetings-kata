import { Mail } from "src/dominio/Mail";
import { MailingRepository } from "src/dominio/MailingRepository";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import NodeMailerMail from "nodemailer/lib/mailer";

const SMTP_PORT = 1025;
const SMTP_URL = "127.0.0.1";
// made protected for testing :-(
async function deliveryMessage({ host, port, ...msg }: Message) {
  const transport = nodemailer.createTransport({ host, port });

  await transport.sendMail(msg);
}
const sendMessage = (mail: Mail) => {
  const message = {
    host: SMTP_URL,
    port: SMTP_PORT,
    from: mail.sender,
    to: [mail.recipient],
    subject: mail.subject,
    text: mail.body,
  };

  deliveryMessage(message);
};

export class NodemailerMailingRepository implements MailingRepository {
  constructor(private mail: Mail)
  send(this.mail: Mail) {
    sendMessage(this.mail);
  }
}

export interface Message
  extends SMTPTransport.Options,
    NodeMailerMail.Options {}

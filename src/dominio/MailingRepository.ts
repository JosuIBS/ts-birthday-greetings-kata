import { Mail } from "./Mail";

export interface MailingRepository {
  send(mail: Mail): void;
}

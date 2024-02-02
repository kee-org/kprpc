import { KdbxUuid } from "kdbxweb";

export interface IGuidService {
    NewGuid(): string;
}

export class GuidService implements IGuidService {
    public NewGuid(): string {
        return KdbxUuid.random().toString();
    }
}

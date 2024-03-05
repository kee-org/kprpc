import { KdbxUuid } from "kdbxweb";

export interface IGuidService {
    NewGuidAsBase64(): string;
}

export class GuidService implements IGuidService {
    public NewGuidAsBase64(): string {
        return KdbxUuid.random().toString();
    }
}

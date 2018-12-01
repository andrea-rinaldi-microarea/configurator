import { Feature } from "./feature";

export class Configuration {
    constructor(
        public name: string,
        public features: Feature[] = [] 
    ) {}
}

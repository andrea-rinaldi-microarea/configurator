import { Feature } from "./Industry";

export class Mago4Module {
    constructor(
        public tag: string,
        public description: string
    ) {}
    public isArea: boolean = false;
    public class: string = "";
    public features: Feature[] = [];
}

export class Mago4Modules {
    constructor() {}

    public modules: Mago4Module[] = [];
}
export class Mago4Module {
    constructor(
        public tag: string,
        public description: string
    ) {}
    public isArea: boolean = false;
    public class: string = "";
}

export class Mago4Modules {
    constructor() {}

    public modules: Mago4Module[] = [];
}
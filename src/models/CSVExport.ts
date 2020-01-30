export class CSVFeature {
    constructor(
        public module: string,
        public functionality: string,
        public tag: string,
        public sbpk: string,
        public adpk: string,
        public trpk: string,
        public fragment: string,
        public base: string,
        public professional: string,
        public enterprise: string
    ) {}
}


export class CSVExport {
    constructor(
        public name: string
    ) {}
    public features: CSVFeature[] = [];
}
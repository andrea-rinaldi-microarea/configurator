
export class Topic {
    constructor(
        public topic: string,
        public order: number,
        public level: number,
        public title: string,
        public details: string,
        public notYetAvailable: boolean,
        public allowISO: string,
        public denyISO: string
    ) {}
}

export class DataSheetLine {
    constructor(
        line: DataSheetLine
    ) { Object.assign(this, line);}

    public topic: string;
    public order: number;
    public level: number;
    public title: string;
    public details: string;
    public notYetAvailable: boolean;
    public allowISO: string;
    public denyISO: string;
    public standard: string;
    public premium: string;
    public professional: string;
    public enterprise: string;

    public included: boolean;
}

export class DataSheet {
    constructor(
        public name: string
    ) {}
    public lines: DataSheetLine[] = [];
}
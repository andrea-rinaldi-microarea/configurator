
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

export class DataSheetLineOption {
    constructor(
        public edition: string
    ) {}

    public availability: string = "";
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
    public options: DataSheetLineOption[] = [];

    public included: boolean;
}

export class DataSheet {
    constructor(
        public name: string
    ) {}
    public lines: DataSheetLine[] = [];
}

export class CSVDataSheetLine {
    constructor(
        line: CSVDataSheetLine
    ) { Object.assign(this, line);}

    public level: number;
    public title: string;
    public details: string;
}

export class CSVDataSheet {
    constructor(
        public name: string
    ) {}
    public lines: CSVDataSheetLine[] = [];
}
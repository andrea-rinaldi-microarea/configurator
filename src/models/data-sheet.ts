
export class Localized {
    constructor(
        public language: string,
        public value: string
    ) {}
}

export class Topic {
    constructor(
        public topic: string,
        public order: number,
        public level: number,
        public title: Localized[] = [],
        public details: Localized[] = [],
        public notYetAvailable: boolean,
        public allowISO: string,
        public denyISO: string
    ) {}
}

export class DataSheetLine {
    constructor(
        public topic: string
    ) {}
    public included: boolean;
    public standard: string;
    public premium: string;
    public professional: string;
    public enterprise: string;
}

export class DataSheet {
    constructor(
        public name: string
    ) {}
    public lines: DataSheetLine[] = [];
}
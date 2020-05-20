
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

export class FeaturesSheetLine {
    constructor(
        public topic: string
    ) {}
    public included: boolean;
    public standard: string;
    public premium: string;
    public professional: string;
    public enterprise: string;
}

export class FeaturesSheet {
    constructor(
        public name: string
    ) {}
    public lines: FeaturesSheetLine[] = [];
}
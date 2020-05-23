
export class FeatureOption {
    constructor(
        public edition: string,
        public availability: string
    ) {}
}

export class Feature {
    constructor(
        public isModule: boolean,
        public description: string,
        public fragment: string,
        public isAvailable: boolean,
        public allowISO: string,
        public denyISO: string,
        public optionID: string,
        public options: FeatureOption[] = [],

        public customer: boolean,
        public tag: string,
        public discontinued: boolean,
        public included: boolean,
        public fromPackage: boolean
    ) {}
}

export class Industry {
    constructor(
        public name: string
    ) {}
    public industryCode: string;
    public version: string;
    public productID: string;
    public productName: string;
    public features: Feature[] = [];
}

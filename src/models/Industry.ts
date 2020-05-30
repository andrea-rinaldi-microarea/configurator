
export class FeatureOption {
    constructor(
        public edition: string,
        public availability: string
    ) {}
}

export class Feature {
    constructor(
        feature: Feature
    ) { Object.assign(this, feature);}

    public fragment: string
    public isModule: boolean;
    public description: string;
    public isAvailable: boolean;
    public allowISO: string;
    public denyISO: string;
    public optionID: string;
    public options: FeatureOption[] = [];

    public customer: boolean;
    public tag: string;
    public discontinued: boolean;
    public included: boolean;
    public fromPackage: boolean
}

export class Distance {
    constructor(
        public edition: string,
        public plus: number = 0,
        public minus: number = 0
    ) {}
}

export class Weight {
    constructor(
        public edition: string,
        public min: number = 0,
        public max: number = 0
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

    public weights: Weight[] = [];
    public clientWeight: number;
    public distances: Distance[] = [];
}

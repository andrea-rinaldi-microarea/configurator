import { Feature } from "./feature";

export class Distance {
    constructor(
        public plus: number = 0,
        public minus: number = 0
    ) {}
}

export class Weight {
    constructor(
        public min: number = 0,
        public max: number = 0
    ) {}
}

export class Configuration {
    constructor(
        public name: string
    ) {}
    public features: Feature[] = [];
    public stdWeight: Weight;
    public proWeight: Weight;
    public entWeight: Weight;
    public clientWeight: number;
    public stdDistance: Distance;
    public proDistance: Distance;
    public entDistance: Distance;
}

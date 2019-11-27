import { Feature } from "./feature";

export class Distance {
    constructor(
        public plus: number = 0,
        public minus: number = 0
    ) {}
}

export class Configuration {
    constructor(
        public name: string
    ) {}
    public features: Feature[] = [];
    public stdDistance: Distance;
    public proDistance: Distance;
    public entDistance: Distance;
}

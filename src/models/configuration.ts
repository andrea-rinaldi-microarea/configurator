import { _Feature } from "./feature";

export class _Distance {
    constructor(
        public plus: number = 0,
        public minus: number = 0
    ) {}
}

export class _Weight {
    constructor(
        public min: number = 0,
        public max: number = 0
    ) {}
}

export class Configuration {
    constructor(
        public name: string
    ) {}
    public industryCode: string;
    public version: string;
    public productID: string;
    public productName: string;
    public features: _Feature[] = [];
    public stdWeight: _Weight;
    public proWeight: _Weight;
    public prmWeight: _Weight;
    public entWeight: _Weight;
    public clientWeight: number;
    public stdDistance: _Distance;
    public proDistance: _Distance;
    public prmDistance: _Distance;
    public entDistance: _Distance;
}

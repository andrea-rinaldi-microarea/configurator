
export class Feature {
    constructor(
        public module: string,
        public functionality: string,
        public tag: string,
        public discontinued: boolean,
        public unavailable: boolean,
        public standard: boolean,
        public professional: boolean,
        public enterprise: boolean,
        public customer: boolean
    ) {}
}

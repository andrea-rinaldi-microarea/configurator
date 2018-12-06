
export class Feature {
    constructor(
        public module: string,
        public functionality: string,
        public tag: string,
        public discontinued: boolean,
        public unavailable: boolean,
        public fromPackage: boolean,
        public standard: string,
        public professional: string,
        public enterprise: string,
        public customer: boolean
    ) {}
}

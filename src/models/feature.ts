
export class Feature {
    constructor(
        public module: string,
        public functionality: string,
        public tag: string,
        public discontinued: boolean,
        public unavailable: boolean,
        public fromPackage: boolean,
        public standard: boolean,
        public standardType: number,
        public professional: boolean,
        public professionalType: number,
        public enterprise: boolean,
        public enterpriseType: number,
        public customer: boolean
    ) {}
}


export class _Feature {
    constructor(
        public module: string,
        public functionality: string,
        public tag: string,
        public discontinued: boolean,
        public fragment: string,
        public included: boolean,
        public notYetAvailable: boolean,
        public fromPackage: boolean,
        public standard: string,
        public professional: string,
        public premium: string,
        public enterprise: string,
        public customer: boolean,
        public allowISO: string,
        public denyISO: string
    ) {}
}

import { SystemConfigurationModel } from "./system-configuration-model";

export class CertIssuingAuthorityModel {
    constructor(
        public lst: SystemConfigurationModel[],
        public lstMr: SystemConfigurationModel[],
        public status: string,
        public errorMessage: string
    ) { }
}
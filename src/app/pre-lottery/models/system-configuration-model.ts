export class SystemConfigurationModel {
    constructor(
        public key: number,
        public configType: string,
        public configKey: string,
        public configValue: string,
        public displayOrder: number
    ) { }
}
export class ScannedDocParamModel {
    constructor(
        public label: string,
        public val: string,
        public children: ScannedDocParamModel[][]
    ) { }
}
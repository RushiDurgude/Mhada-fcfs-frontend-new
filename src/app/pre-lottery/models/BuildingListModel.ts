export class BuildingListModel {
    constructor(
        public key: number,
        public isActive :string, 
        public  status:string,
        public buildingNo:string ,
        public schemeId:number,
        public wing:string,
        public floor:number,
        public flatNo:number,
        ) { }
}
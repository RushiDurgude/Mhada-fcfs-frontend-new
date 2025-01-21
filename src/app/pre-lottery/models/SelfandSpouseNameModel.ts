export class SelfandSpouseNameModel {
  constructor(
    public key: number,
    public applicationNo: number,
    public registrationKey: number,
    public marriageStatus: string,
    public spouseAadharName: string,
    public gender: string,
    public spousePanName: string, 
    public applicantAadharName: string,  
    public applicantPanName: string, 
  ) {}
}

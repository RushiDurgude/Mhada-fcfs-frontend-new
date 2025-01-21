export class ApplicantEditingDetailModel {
  constructor(
    public registrationId: number,
    public applicationId: number,
    public applicationNo: string,
    public applicantPhoto: string,
    public applicantName: string,
    public marriageStatus: string,
    public newMaritalStatus: string,
    public selectedType: string,
    public value: number,
    public status: string
  ) {}
}

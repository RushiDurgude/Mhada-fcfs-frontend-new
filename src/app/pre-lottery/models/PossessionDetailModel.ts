export class PossessionDetailModel {
  constructor(
    public key: number,
    public applicationNo: number,
    public NewMaritalStatus: string,
    public marriageStatus: string,
    public applicantPhoto: string | ArrayBuffer,
    public spousePhoto: string | ArrayBuffer,
    public familyPhoto: string | ArrayBuffer,
    public applicantPhotoName: string,
    public familyPhotoName: string,
    public spousePhotoName: string,
    public spouseEmailId: string,
    public spouseName: string,
    public possApplicantName: string,
    public gender: string,
    public applicableSpouseName: string,
    public userResponsibilityLst: string[]
  ) {}
}

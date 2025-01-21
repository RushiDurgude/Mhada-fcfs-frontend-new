export class ApplicantMarriageStatusModel {
  constructor(
    public applicationNo: number,
    public oldMaritalStatus: string,
    public newMaritalStatus: string,
    public spouseName: string,
    public spousePan: string,
    public spousePanFile: string | ArrayBuffer,
    public spouseAadhaar: string,
    public spouseAadharFile: string | ArrayBuffer,
    public marriageCertificateFile: string | ArrayBuffer,
    public courtOrderFile: string | ArrayBuffer,
    public deathCertificateFile: string | ArrayBuffer,
    public selectedType: string,
    public fileNamePan: string,
    public fileNameAaadhar: string,
    public fileNameMarriageCertificate: string,
    public fileNameCourtOrder: string,
    public fileNameDeathCertificate: string
  ) {}
}

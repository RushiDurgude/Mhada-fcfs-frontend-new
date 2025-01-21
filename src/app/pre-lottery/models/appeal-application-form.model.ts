export class AppealApplicationFormModel {
  constructor(
    public applicationNo: string,
    public applicantName: string,
    public appealLetterFile: string,
    public additionalDocumentFile: string,
    public applicationKey: number,
    public remark: string,
    public rejectRemark: string,
    public hearingRemark: string,
    public appealType: string,
    public status: string,
    public appealHearingStatus: string,
    public appealDate: string,
    public orderDocumentFile: string
  ) {}
}

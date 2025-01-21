export class ApplicationOtherDocumentModel {
  constructor(
    public key: number,
    public configDetails: string,
    public status: string,
    public otherDocumentLst: {
      key: number;
      applicationId: string;
      documentName: string;
      documentPdfFile: string;
    }[]
  ) {}
}

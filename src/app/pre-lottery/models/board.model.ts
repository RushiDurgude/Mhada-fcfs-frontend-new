export class BoardModel {
  constructor(
    public key: number,
    public boardName: string,
    public boardImage: string,
    public showBoardDocuments: boolean,
    public boardType: string,
    public fcfsUrl: string
  ) {}
}

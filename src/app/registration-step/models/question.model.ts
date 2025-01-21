export class QuestionModel {
    constructor(
      public question: string,
      public helpVideo: string,
      public questionCode: string,
      public actionImage: string,
      public questionPercentage: number,
      public ocrRequired: string,
      public stage: string
    ) { }
  }
  
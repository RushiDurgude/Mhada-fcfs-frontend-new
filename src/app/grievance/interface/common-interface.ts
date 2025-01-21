export interface ApplicationInterface {
    applicationName: any
    key: any
  }


  export interface Board {
    boardCode: any
    boardName: any
    key: any
  }

  export interface Channel {
    pkChid: any
    channelName: any
    createdBy: any
    createdOn: any
    updatedBy: any
    updatedOn: any
    isManual: any
}


export interface GrievanceType {
    pkGtid: any
    fkDepid: any
    fkBdid: any
    gtGrievanceType: any
    forMhadaUser: any
    forLotteryUser: any
    forGeneralPublic: any
    gtEscalationDuration: any
    gtLevels: any
    gtAutocloseDuration: any
    createdBy: any
    createdOn: any
    updatedBy: any
    updatedOn: any
}

export interface PaymentInterface {
    key:any,
    paymentAmount:any,
    createdOn:any
}

export interface Status {
    pkStid: any; 
    statusName: any; 
    isEscalable: any; 
    createdBy: any; 
    createdOn: any; 
    updatedBy: any; 
    updatedOn: any; 
    isManual: any;
}
export interface Lottery {
    lotteryName:any,
    key:any
}
  export interface ApplicationInterface {
    applicationName: any
    applicationNo:any
    key: any
  }
  export interface ObjSuggestionType{
    pkOstid:any
    objectionSuggestion:any
  }
import { FormControl, ValidatorFn, Validators } from "@angular/forms";

const customPatternValid = (config: any): ValidatorFn => {
    return (control: FormControl) => {
      let urlRegEx: RegExp = config.pattern;
      if (control.value && !control?.value?.toString().match(urlRegEx)) {
        return {
          customPattern: config.msg
        };
      } else {
        return null;
      }
    };
}

export const FIELDS = {
    "applicantName": {
        fieldName: "applicantName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "experienceInYears": {
        fieldName: "experienceInYears",
        formControl: new FormControl(null, [Validators.required, 
            customPatternValid({pattern: /^[0-9]*$/, msg: 'error-only-numbers-allowed'}), 
            Validators.min(1)])
    },
    "artistType": {
        fieldName: "artistType",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "departmentName": {
        fieldName: "departmentName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "designation": {
        fieldName: "designation",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "retirementDate": {
        fieldName: "retirementDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "dfRetirementDate": {
        fieldName: "dfRetirementDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "cgRetirementDate": {
        fieldName: "cgRetirementDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "sgRetirementDate": {
        fieldName: "sgRetirementDate",
        formControl: new FormControl(null)//TODO Date validation
    },
    "currentAddress": {
        fieldName: "currentAddress",
        formControl: new FormControl(null, [Validators.required])
    },
    "staffQuarterAllotmentDate": {
        fieldName: "staffQuarterAllotmentDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "age": {
        fieldName: "age",
        formControl: new FormControl(null, [Validators.required, 
            customPatternValid({pattern: /^[0-9]*$/, msg: 'error-only-numbers-allowed'}), 
        Validators.min(18)])
    },
    "residentialAddress": {
        fieldName: "residentialAddress",
        formControl: new FormControl(null, [Validators.required])
    },
    "relation": {
        fieldName: "relation",
        formControl: new FormControl(null, [Validators.required])
    },
    "defensePersonnelName": {
        fieldName: "defensePersonnelName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "serviceNo": {
        fieldName: "serviceNo",
        formControl: new FormControl(null, [Validators.required])
    }, 
    "rank": {
        fieldName: "rank",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "serviceYears": {
        fieldName: "serviceYears",
        formControl: new FormControl(null, [Validators.required, 
            customPatternValid({pattern: /^[0-9]*$/, msg: 'error-only-numbers-allowed'}), 
        Validators.min(1)])
    },
    "serviceMonths": {
        fieldName: "serviceMonths",
        formControl: new FormControl(null, [Validators.required, 
            customPatternValid({pattern: /^[0-9]*$/, msg: 'error-only-numbers-allowed'}), 
        Validators.min(0)])
    },
    "joiningDate": {
        fieldName: "joiningDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "serviceName": {
        fieldName: "serviceName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "exServiceYears": {
        fieldName: "exServiceYears",
        formControl: new FormControl(null, [Validators.required, 
            customPatternValid({pattern: /^[0-9]*$/, msg: 'error-only-numbers-allowed'})])
    }, 
    "sgServiceYears": {
        fieldName: "sgServiceYears",
        formControl: new FormControl(null, [Validators.required, 
            customPatternValid({pattern: /^[0-9]*$/, msg: 'error-only-numbers-allowed'}), 
        Validators.min(5)])
    }, 
    "identificationNo": {
        fieldName: "identificationNo",
        formControl: new FormControl(null, [Validators.required])
    }, 
    "exServiceManType": {
        fieldName: "exServiceManType",
        formControl: new FormControl(null, [Validators.required])
    }, 
    "exServiceManName": {
        fieldName: "exServiceManName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "freedomFighterType": {
        fieldName: "freedomFighterType",
        formControl: new FormControl(null, [Validators.required])
    }, 
    "freedomFighterName": {
        fieldName: "freedomFighterName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "organizationName": {
        fieldName: "organizationName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "fromDate": {
        fieldName: "fromDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "endDate": {
        fieldName: "endDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "constituencyName": {
        fieldName: "constituencyName",
        formControl: new FormControl(null, [Validators.required, Validators.maxLength(250), 
            customPatternValid({pattern: /^[A-Za-z\s]*$/, msg: 'error-only-alphabets-space-allowed'})])
    },
    "type": {
        fieldName: "type",
        formControl: new FormControl(null, [Validators.required])
    },
    "appointmentDate": {
        fieldName: "appointmentDate",
        formControl: new FormControl(null, [Validators.required])//TODO Date validation
    },
    "jrExperienceApptCert": {
        fieldName: "jrExperienceApptCert",
        formControl: new FormControl("", [Validators.required])
    },
    "jrIncomeProof": {
        fieldName: "jrIncomeProof",
        formControl: new FormControl("", [Validators.required])
    },
    "jrRecomLetter": {
        fieldName: "jrRecomLetter",
        formControl: new FormControl("", [Validators.required])
    },
    "jrBylineArtOrVideo": {
        fieldName: "jrBylineArtOrVideo",
        formControl: new FormControl(null, [Validators.required])
    },
    "jrBylineArticle": {
        fieldName: "jrBylineArticle",
        formControl: new FormControl("", [Validators.required])
    },
    "jrIdCard": {
        fieldName: "jrIdCard",
        formControl: new FormControl("", [Validators.required])
    },
    "jrSelfDeclaration": {
        fieldName: "jrSelfDeclaration",
        formControl: new FormControl("", [Validators.required])
    },
    "jrAgencyApprovlCert": {
        fieldName: "jrAgencyApprovlCert",
        formControl: new FormControl("", [Validators.required])
    }
};

export const CATEGORY_FIELDS = {
    "AR": [FIELDS.applicantName, FIELDS.experienceInYears, FIELDS.artistType],
	"CG": [FIELDS.applicantName, FIELDS.departmentName, FIELDS.designation, 
        FIELDS.cgRetirementDate, FIELDS.currentAddress, FIELDS.staffQuarterAllotmentDate],
	"DF": [FIELDS.applicantName,  
        FIELDS.serviceNo, FIELDS.rank, FIELDS.serviceYears, 
        FIELDS.serviceMonths, FIELDS.joiningDate, FIELDS.dfRetirementDate, 
        FIELDS.age, FIELDS.residentialAddress, 
        FIELDS.relation, FIELDS.defensePersonnelName],
	"EX": [FIELDS.applicantName, FIELDS.serviceNo, FIELDS.rank, 
        FIELDS.serviceName, FIELDS.exServiceYears, FIELDS.joiningDate, 
        FIELDS.retirementDate, FIELDS.identificationNo, 
        FIELDS.exServiceManType, 
        // FIELDS.age, FIELDS.residentialAddress, FIELDS.relation, 
        // FIELDS.exServiceManName
        ],
	"FF": [FIELDS.applicantName, FIELDS.age, FIELDS.residentialAddress, 
        FIELDS.freedomFighterType, 
        // FIELDS.relation, 
        // FIELDS.freedomFighterName
        ],
	"JR": [FIELDS.applicantName, FIELDS.organizationName, FIELDS.designation, 
        FIELDS.jrExperienceApptCert, FIELDS.jrIncomeProof, FIELDS.jrRecomLetter, 
        FIELDS.jrBylineArtOrVideo, FIELDS.jrIdCard, FIELDS.jrSelfDeclaration, 
        FIELDS.jrAgencyApprovlCert],
	"MP_MLA_MLC": [FIELDS.applicantName, FIELDS.fromDate, FIELDS.endDate, 
        FIELDS.constituencyName, FIELDS.type],
	"SG": [FIELDS.applicantName, FIELDS.designation, FIELDS.appointmentDate, 
        FIELDS.sgServiceYears, FIELDS.serviceMonths, FIELDS.sgRetirementDate]
};
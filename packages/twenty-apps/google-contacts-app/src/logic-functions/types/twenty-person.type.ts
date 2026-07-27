export type TwentyPerson = {
  name: {
    firstName: string;
    lastName: string;
  },
  emails: {
    primaryEmail: string;
    additionalEmails: string[];
  }
  jobTitle: string;
  phones: {
    primaryPhoneNumber: string;
    primaryPhoneCallingCode: string;
    primaryPhoneCountryCode: string;
  }
  linkedinLink: {
    primaryLinkLabel: string;
    primaryLinkUrl: string;
  }
  xLink: {
    primaryLinkLabel: string;
    primaryLinkUrl: string;
  }
}
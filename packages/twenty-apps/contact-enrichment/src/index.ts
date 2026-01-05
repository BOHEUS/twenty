import axios from 'axios';
import { type FunctionConfig } from 'twenty-sdk';
import type {
  fullEnrichRequest,
  fullEnrichPerson,
  twentyPerson,
  twentyCompany,
  twentyPersonSocialMedia,
  twentyPersonPhones,
} from './types';

const TWENTY_API_KEY: string = process.env.TWENTY_API_KEY ?? '';
const TWENTY_API_URL: string =
  process.env.TWENTY_API_URL !== '' && process.env.TWENTY_API_URL !== undefined
    ? `${process.env.TWENTY_API_URL}/rest`
    : 'https://api.twenty.com/rest';
const TWENTY_URL: string = process.env.TWENTY_URL ?? '';
const FULL_ENRICH_API_KEY: string = process.env.FULLENRICH_API_KEY ?? '';
const FULL_ENRICH_API_URL =
  'https://app.fullenrich.com/api/v1/contact/enrich/bulk';
const FULL_ENRICH_DATA_REQUIREMENTS: string =
  process.env.FULLENRICH_DATA_REQUIREMENTS ?? '';
const FULL_ENRICH_REQUEST_CONSTRAINTS: string[] =
  process.env.FULLENRICH_REQUEST_CONSTRAINTS.split(",") ?? "".split("");

const updateTwentyCompany = async (recordId: string, companyData: twentyCompany): Promise<boolean> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TWENTY_API_KEY}`,
    },
    url: `${TWENTY_API_URL}/companies/${recordId}`,
    data: companyData,
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const updateTwentyPerson = async (recordId: string, personData: twentyPerson): Promise<boolean> => {
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TWENTY_API_KEY}`,
    },
    url: `${TWENTY_API_URL}/people/${recordId}`,
    data: personData,
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const fetchTwentyCompany = async (
  companyId: string,
): Promise<twentyCompany> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
    },
    url: `${TWENTY_API_URL}/companies/${companyId}`,
  };
  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      return response.data.data.company as twentyCompany;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const findLinkedPerson = async (companyId: string): Promise<twentyPerson[]> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
    },
    url: `${TWENTY_API_URL}/people?filter=companyId%5Beq%5D%3A%22${companyId}`,
  };
  try {
    const response = await axios.request(options);
    if (response.status === 201) {
      return response.data.data.people; // there can be more than 1 person record or none
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const sendRequestToFullEnrich = async (
  data: fullEnrichRequest,
): Promise<boolean> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${FULL_ENRICH_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: FULL_ENRICH_API_URL,
    data: data,
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const fullEnrichRequirements = () => {
  let options: string[] = ['contact.emails'];
  if (FULL_ENRICH_DATA_REQUIREMENTS.includes('personal_emails')) {
    options.push('contact.personal_emails');
  }
  if (FULL_ENRICH_DATA_REQUIREMENTS.includes('phones')) {
    options.push('contact.phones');
  }
  return options;
};

const checkPersonRequirements = (twentyPerson: twentyPerson) => {
  const phones = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("person.phones") ? (twentyPerson.phones.primaryPhoneNumber !== "") : true;
  const email = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("person.email") ? (twentyPerson.emails.primaryEmail !== "") : true;
  const x = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("person.xLink") ? (twentyPerson.xLink.primaryLinkUrl !== "") : true;
  const city = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("person.city") ? (twentyPerson.city !== "") : true;
  const intro = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("person.intro") ? (twentyPerson.intro !== "") : true;
  const jobTitle = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("person.jobTitle") ? (twentyPerson.jobTitle !== "") : true;
  return twentyPerson.name.firstName !== "" &&
    twentyPerson.name.lastName !== "" &&
    twentyPerson.linkedinLink.primaryLinkUrl !== "" &&
    phones && email && x && city && intro && jobTitle;
}

const checkCompanyRequirements = (twentyCompany: twentyCompany) => {
  const employees = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("company.employees") ? (twentyCompany.employees !== null) : true;
  const address = FULL_ENRICH_REQUEST_CONSTRAINTS.includes("company.address") ? (
      twentyCompany.address.addressStreet1 !== "" &&
      twentyCompany.address.addressStreet2 !== "" &&
      twentyCompany.address.addressState !== "" &&
      twentyCompany.address.addressCity !== "" &&
      twentyCompany.address.addressPostCode !== "" &&
      twentyCompany.address.addressCountry !== ""
  ) : true;
  return twentyCompany.name !== "" && twentyCompany.domainName.primaryLinkUrl !== "" && employees && address;
}

export const main = async (params: {
  properties: Record<string, any>;
  recordId?: string;
  userId?: string;
}): Promise<object> => {
  if (
    TWENTY_API_KEY === '' ||
    FULL_ENRICH_API_KEY === '' ||
    TWENTY_URL === ''
  ) {
    console.warn('Missing parameters');
    return {};
  }

  try {
    const { properties, recordId } = params;
    if (recordId === undefined) {
      const input: fullEnrichPerson = {
        // map to fullenrich record
        firstname: properties.firstname,
        lastname: properties.lastname,
        most_probable_email: properties.most_probable_email,
        most_probable_email_status: properties.most_probable_email_status,
        most_probable_phone: properties.most_probable_phone,
        emails: properties.emails,
        phones: properties.phones,
        social_medias: properties.social_medias,
        profile: properties.profile,
      };
      const twentyCompany: twentyCompany = {
        name: input.profile.position.company.name,
        domainName: {
          primaryLinkUrl: input.profile.position.company.website,
          primaryLinkLabel: '',
        },
        employees: input.profile.position.company.headcount,
        linkedinLink: {
          primaryLinkLabel: '',
          primaryLinkUrl: input.profile.position.company.linkedin_url,
        },
        address: {
          addressStreet1:
            input.profile.position.company.headquarters.address_line_1,
          addressStreet2:
            input.profile.position.company.headquarters.address_line_2,
          addressCity: input.profile.position.company.headquarters.city,
          addressCountry: input.profile.position.company.headquarters.country,
          addressPostCode:
            input.profile.position.company.headquarters.postalCode,
          addressState: input.profile.position.company.headquarters.region,
        },
      };
      const isCompanyUpdated: boolean = await updateTwentyCompany(properties.custom.companyId, twentyCompany);
      if (isCompanyUpdated) {
        console.log(`Successfully updated ${twentyCompany.name} company in Twenty.`)
      }
      const mails: string[] | null = input.emails.find((email) =>
        ['DELIVERABLE', 'HIGH_PROBABILITY'].includes(email.status),
      )
        ? input.emails
            .map((email) =>
              ['DELIVERABLE', 'HIGH_PROBABILITY'].includes(email.status)
                ? email.email
                : '',
            )
            .filter((email) => email.length > 0)
        : null;
      const linkedinLink: twentyPersonSocialMedia = input.social_medias.find(
        (media) => media.type === 'LINKEDIN',
      )
        ? {
            primaryLinkLabel: '',
            primaryLinkUrl: input.social_medias.find(
              (media) => media.type === 'LINKEDIN',
            ).url,
          }
        : { primaryLinkLabel: '', primaryLinkUrl: '' };
      const xLink: twentyPersonSocialMedia = input.social_medias.find(
        (media) => media.type === 'TWITTER',
      )
        ? {
            primaryLinkLabel: '',
            primaryLinkUrl: input.social_medias.find(
              (media) => media.type === 'TWITTER',
            ).url,
          }
        : { primaryLinkLabel: '', primaryLinkUrl: '' };
      const phones: twentyPersonPhones =
        input.most_probable_phone === undefined ||
        input.most_probable_phone === ''
          ? {
              primaryPhoneNumber: '',
              primaryPhoneCallingCode: '',
              additionalPhones: null,
            }
          : input.phones.length === 1
            ? {
                primaryPhoneNumber: input.most_probable_phone.split(' ', 2)[0],
                primaryPhoneCallingCode: input.most_probable_phone.split(
                  ' ',
                  2,
                )[1],
                additionalPhones: null,
              }
            : {
                primaryPhoneNumber: input.most_probable_phone.split(' ', 2)[0],
                primaryPhoneCallingCode: input.most_probable_phone.split(
                  ' ',
                  2,
                )[1],
                additionalPhones: input.phones.map((phone) => phone.number),
              };
      const twentyPersonData: twentyPerson = {
        name: { firstName: input.firstname, lastName: input.lastname },
        emails: {
          primaryEmail: input.most_probable_email,
          additionalEmails: mails,
        },
        linkedinLink: linkedinLink,
        xLink: xLink,
        jobTitle: input.profile.position.title,
        phones: phones,
        city: input.profile.location,
        intro: input.profile.summary,
        companyId: properties.custom.companyId,
      };
      const isPersonUpdated = await updateTwentyPerson(properties.custom.personId, twentyPersonData);
      if (isPersonUpdated) {
        console.log(`Person ${input.firstname} ${input.lastname} has been updated successfully.`);
        return {};
      } else {
        throw new Error(`There was an error updating ${input.firstname} ${input.lastname} person.`);
      }
    } else {
      if (properties.after.companyId !== undefined) {
        // map to twentyPerson
        // companyId is either string or null but never undefined
        if (
          properties.after.companyId === null ||
          properties.after.linkedinLink.primaryLinkUrl === '' ||
          properties.after.name.firstName === '' ||
          properties.after.name.lastName === ''
        ) {
          console.warn('Missing person parameters');
          return {};
        }
        const input: twentyPerson = {
          id: recordId,
          name: properties.after.name,
          emails: properties.after.emails,
          linkedinLink: properties.after.linkedinLink,
          xLink: properties.after.xLink,
          jobTitle: properties.after.jobTitle,
          phones: properties.after.phones,
          city: properties.after.city,
          intro: properties.after.intro,
          companyId: properties.after.companyId,
        };
        if (checkPersonRequirements(input)) {
          console.log(`Request to FullEnrich not sent as all necessary data are present in ${input.name.firstName} ${input.name.lastName} record.`);
          return {};
        }
        const linkedCompany: twentyCompany = await fetchTwentyCompany(
          input.companyId,
        );
        if (
          linkedCompany.name === '' &&
          linkedCompany.domainName.primaryLinkUrl === ''
        ) {
          console.warn('Missing company parameters');
          return {};
        }
        if (checkCompanyRequirements(linkedCompany)) {
          console.log(`Request to FullEnrich not sent as all necessary data are present in ${linkedCompany.name} record.`);
          return {};
        }
        const fullEnrichRequestData: fullEnrichRequest = {
          name: `Twenty contact enrichment - ${input.name.firstName} ${input.name.lastName}`,
          webhook_url: `${TWENTY_URL}/s/webhook/fullenrich`,
          datas: [
            {
              firstname: input.name.firstName,
              lastname: input.name.lastName,
              domain: linkedCompany.domainName.primaryLinkUrl,
              company_name: linkedCompany.name,
              linkedin_url: input.linkedinLink.primaryLinkUrl,
              enrich_fields: fullEnrichRequirements(),
              custom: {
                personId: recordId,
                companyId: input.companyId,
              },
            },
          ],
        };
        const isRequestSent = await sendRequestToFullEnrich(
          fullEnrichRequestData,
        );
        if (isRequestSent) {
          console.log('Request to FullEnrich sent successfully.');
        } else {
          console.error('Request to FullEnrich failed.');
        }
        return {};
      } else {
        // map to twenty company record
        if (
          properties.after.domainName.primaryLinkUrl === '' &&
          properties.after.name === ''
        ) {
          console.error('No company name or website');
          return {};
        }
        const input: twentyCompany = {
          id: recordId,
          name: properties.after.name,
          domainName: properties.after.domainName,
          employees: properties.after.employees,
          linkedinLink: properties.after.linkedinLink,
          address: properties.after.address,
        };
        if (checkCompanyRequirements(input)) {
          console.log(`Request to FullEnrich not sent as all necessary data are present in ${input.name} record.`)
          return {};
        }

        const linkedPeople: twentyPerson[] = await findLinkedPerson(input.id);
        if (linkedPeople.length === 0) {
          console.warn(`No linked people to company ${input.name}`);
          return {};
        }
        for (const person of linkedPeople) {
          if (
            person.name.firstName === '' ||
            person.name.lastName === '' ||
            person.linkedinLink.primaryLinkUrl === ''
          ) {
            console.log(`Missing data in person record with ID ${person.id}`);
            continue;
          }
          if (checkPersonRequirements(person)) {
            console.log(`Request to FullEnrich not sent as all necessary data are present in ${person.name.firstName} ${person.name.lastName} record.`)
            continue;
          }
          const fullEnrichRequestData: fullEnrichRequest = {
            name: `Twenty contact enrichment - ${person.name.firstName} ${person.name.lastName}`,
            webhook_url: `${TWENTY_URL}/s/webhook/fullenrich`,
            datas: [
              {
                firstname: person.name.firstName,
                lastname: person.name.lastName,
                domain: input.domainName.primaryLinkUrl,
                company_name: input.name,
                linkedin_url: person.linkedinLink.primaryLinkUrl,
                enrich_fields: fullEnrichRequirements(),
                custom: {
                  personId: person.id,
                  companyId: recordId,
                },
              },
            ],
          };
          const isRequestSent: boolean = await sendRequestToFullEnrich(
            fullEnrichRequestData,
          );
          if (isRequestSent) {
            console.log(
              `Request for ${person.name.firstName} ${person.name.lastName} to FullEnrich sent successfully.`,
            );
          } else {
            console.error(
              `Request for ${person.name.firstName} ${person.name.lastName} to FullEnrich failed.`,
            );
          }
        }
      }
    }
    return {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return {};
    }
    console.error(error);
    return {};
  }
};

export const config: FunctionConfig = {
  universalIdentifier: 'cfae75f0-11c2-4c01-aa6f-b8e52ba678a8',
  name: 'contact-enrichment',
  triggers: [
    {
      universalIdentifier: '59bc1f20-1c73-4f8b-8001-85efd4d30226',
      type: 'databaseEvent',
      eventName: 'person.created',
    },
    {
      universalIdentifier: 'fe2b4e75-8811-4461-a6e3-72a97e39a392',
      type: 'databaseEvent',
      eventName: 'person.updated',
    },
    {
      universalIdentifier: 'f4c62baa-d534-4d0d-a233-5993882a5e79',
      type: 'databaseEvent',
      eventName: 'company.created',
    },
    {
      universalIdentifier: 'd1ec7972-15d5-4948-93db-0853b9f6191e',
      type: 'databaseEvent',
      eventName: 'company.updated',
    },
    {
      universalIdentifier: 'a64fb3b7-a0c3-4cdb-9b71-df9efa3a877f',
      type: 'route',
      path: '/webhook/fullenrich',
      httpMethod: 'POST',
      isAuthRequired: false,
    },
  ],
};

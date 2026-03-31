import axios from 'axios';
import { defineLogicFunction, RoutePayload } from 'twenty-sdk';
import {
  type stripeCustomer,
  type stripeEvent,
  type stripeStatus,
} from './types';
import stripe from 'stripe';
import { CoreApiClient } from 'twenty-client-sdk/core';

const STRIPE_WEBHOOK_SECRET: string = process.env.STRIPE_WEBHOOK_SECRET ?? '';
const STRIPE_API_KEY: string = process.env.STRIPE_API_KEY ?? '';
const STRIPE_API_URL: string = 'https://api.stripe.com/v1/customers';

const getStripeCustomerData = async (
  customerID: string,
): Promise<stripeCustomer | undefined> => {
  const options = {
    method: 'GET',
    url: `${STRIPE_API_URL}/${customerID}`,
    auth: {
      username: STRIPE_API_KEY,
      password: '',
    },
  };
  try {
    const response = await axios(options);
    return response.status === 200
      ? ({
          name: response.data.name,
          businessName: response.data.business_name,
          email: response.data.email,
        } as stripeCustomer)
      : ({} as stripeCustomer);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const checkIfCompanyExistsInTwenty = async (
  name: string | undefined,
) => {

  const client = new CoreApiClient();
  client.mutation({

  })
  // filter by name
  const result = await client.query({
    companies: {
      edges: {
        node: {
          id: true,
          name: true,
          // Add other fields as needed
        },
      },
      __args: {
        filter: {
          name: {
            eq: 'Your Company Name', // Exact match
          },
        },
      },
    },
  });

  if (!result){
    throw new Error('');
  }

  return result;
};

const updateTwentyCompany = async (
  companyId: string | undefined,
  seats: number | null,
  subStatus: stripeStatus,
): Promise<void> => {
  const client = new CoreApiClient();
  /*
  const result = await client.mutation({
    updateCompany: {
      __args: {
        id: companyId,
        data: {
          seats: seats,
          subStatus: subStatus,
        }
      },
      id: true,
    },
  });

  if (!result.updateCompany) {
            throw new Error('Update of Stripe customer in Twenty failed');

  }*/
};

const createTwentyCompany = async (
  customerName: string | undefined,
  seats: number | null,
  subStatus: string,
): Promise<void> => {
  const client = new CoreApiClient();

  throw new Error('Creation of Stripe customer in Twenty failed');
};

const checkIfStripePersonExistsInTwenty = async (email: string | null) => {
  // mail is unique by default so there can be only 1 person with given mail
  const client = new CoreApiClient();
};

const addTwentyPerson = async (
  firstName: string,
  lastName: string,
  email: string,
  companyId: string,
  seats: number,
  subStatus: stripeStatus,
): Promise<void> => {
  const client = new CoreApiClient();

  /*const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${TWENTY_API_URL}/people`,
    data: {
      firstName: firstName,
      lastName: lastName,
      emails: { primaryEmail: email },
      companyId: companyId,
      seats: seats,
      subStatus: subStatus,
    },
  };
          throw new Error('Adding Stripe person to Twenty failed');

  */
};

const updateTwentyPerson = async (
  id: string,
  seats: number,
  subStatus: stripeStatus,
): Promise<void> => {
  const client = new CoreApiClient();
  /*
  const result = await client.mutation({
    updatePerson: {
      __args: {
        id: id,
        data: {
          seats: seats,
          subStatus: subStatus,
        }
      },
      id: true,
    }
  });

  if (!result.updatePerson) {
              throw new Error('Update of Stripe person in Twenty failed');
  }

  return result;
   */
};

const handler = async (
  event: RoutePayload
): Promise<object | undefined> => {
  if (STRIPE_API_KEY === '' || STRIPE_WEBHOOK_SECRET === '') {
    throw new Error('Missing variables');
  }

  try {
    if (
      event.body === null ||
      event.headers['http_stripe_signature'] === undefined
    ) {
      console.warn('');
      return {};
    }
    const stripEvent = stripe.webhooks.constructEvent(event.body.toString(), event.headers['http_stripe_signature'], STRIPE_WEBHOOK_SECRET);
    const stripeEvent = event.body as stripeEvent;
    const allowed_types: string[] = [
      'customer.subscription.created',
      'customer.subscription.updated',
    ];
    if (!allowed_types.includes(stripeEvent.type)) {
      throw new Error('Wrong type of webhook');
    }

    const stripeCustomer: stripeCustomer | undefined =
      await getStripeCustomerData(stripeEvent.data.object.customer);
    if (
      stripeCustomer?.businessName === undefined ||
      stripeCustomer?.businessName === ''
    ) {
      console.warn('Set customer business name in Stripe');
      return {};
    }

    const twentyCompanyId: string | undefined = '';
      await checkIfCompanyExistsInTwenty(stripeCustomer?.businessName);
    const seats: number =
      stripeEvent.data.object.quantity ??
      stripeEvent.data.object.items.data.reduce(
        (acc, item) => acc + item.quantity,
        0,
      ); // we don't know if subscription has only 1 item (product) or more
    let updatedTwentyCompanyId: string | undefined;
    if (twentyCompanyId === '') {
      const twentyCompanyCreated: string | undefined = '';
        await createTwentyCompany(
          stripeCustomer?.businessName,
          seats,
          stripeEvent.data.object.status.toUpperCase(),
        );
        console.log('Creation of Stripe customer in Twenty succeeded');
        updatedTwentyCompanyId = twentyCompanyCreated;
    } else {
        await updateTwentyCompany(
          twentyCompanyId,
          seats,
          stripeEvent.data.object.status.toUpperCase() as stripeStatus,
        );
        console.log('Update of Stripe customer in Twenty succeeded');
        updatedTwentyCompanyId = twentyCompanyId;

    }

    if (updatedTwentyCompanyId === undefined || updatedTwentyCompanyId === '') {
      throw new Error('TwentyCompanyId not found');
    } else {
      const stripeCustomerInTwenty: string | undefined = '';
        await checkIfStripePersonExistsInTwenty(stripeCustomer.email);
      if (stripeCustomerInTwenty === '') {
        if (!stripeCustomer.name) {
          throw new Error('Missing Stripe customer first or last name');
        }
        if (!stripeCustomer.email) {
          throw new Error('Missing Stripe customer email');
        }
        const firstName: string = stripeCustomer.name?.split(' ')[0];
        const lastName: string = stripeCustomer.name?.split(' ')[1];
         await addTwentyPerson(
            firstName,
            lastName,
            stripeCustomer.email,
            updatedTwentyCompanyId,
            seats,
            stripeEvent.data.object.status.toUpperCase() as stripeStatus,
          );
          console.log('Stripe person was added to Twenty');
      } else if (stripeCustomerInTwenty !== undefined) {
          await updateTwentyPerson(
            stripeCustomerInTwenty,
            seats,
            stripeEvent.data.object.status.toUpperCase() as stripeStatus,
          );
          console.log('Update of Stripe person in Twenty succeeded');
      } else {
        throw new Error('Twenty not found');
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

export default defineLogicFunction({
  universalIdentifier: 'cd15a738-18a5-406e-8b83-959dc52ebe14',
  name: 'on-stripe-webhook',
  description: 'Triggered on webhook from Stripe',
  handler,
  httpRouteTriggerSettings:
    {
      path: '/webhook/stripe',
      httpMethod: 'POST',
      isAuthRequired: false,
      forwardedRequestHeaders: ['HTTP_STRIPE_SIGNATURE']
    },
});

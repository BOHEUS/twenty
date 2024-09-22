import { APIRequest, request } from '@playwright/test';

export class GraphQLAPI {
  readonly request: APIRequest;

  constructor() {
    this.request = request;
  }
}

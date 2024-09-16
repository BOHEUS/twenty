import { APIRequest, request } from '@playwright/test';

export class RestAPI {
  readonly request: APIRequest;

  constructor() {
    this.request = request;
  }
}

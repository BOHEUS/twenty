import { request } from '@playwright/test';

export class RestAPI {
  readonly request = request;

  constructor() {
    this.request = request;
  }
}

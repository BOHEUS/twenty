# Contact enrichment

Contact enrichment when new person record is created.

## Requirements
- an `apiKey` - go to Settings > API & Webhooks to generate one
- FullEnrich API key

## Setup
1. Synchronize app with Twenty
```bash
cd packages/twenty-apps/contact-enrichment
yarn auth
yarn sync
```
2. Go to Settings > Integrations > Contact enrichment > Settings and set variables

## Flow
- Check if input is from Twenty or FullEnrich
- Map all input properties properly
- If it's from FullEnrich, send a request to update existing records (person and related company)
- If it's from Twenty, check if requirements are met, if they're met, 
send a request to FullEnrich, if not, exit

## Notes
- Requirements described by FullEnrich are described below (taken from https://docs.fullenrich.com/startbulk): 
  - LinkedIn or
  - first and last name with company 
    - name or
    - domain
- App will send a request only when all data are present to maximize the chance of finding a person and related company
- By default, app will send a request to FullEnrich to enrich only business emails of contact, 
if you want to change that behaviour to look for more data, set value of FULLENRICH_DATA_REQUIREMENTS to one of three following options:
  - `personal_emails`
  - `phones`
  - `personal_emails,phones`
- FullEnrich can return following data:
  - person:
    - first name
    - last name
    - business emails
    - personal emails
    - phone numbers
    - Twitter profile
    - linkedin profile
    - location (city)
    - summary
  - company:
    - name
    - LinkedIn
    - website
    - headcount
    - HQ address
- To change requirements which must be met before sending request to FullEnrich (to prevent wasting credits), please set one or more separated with comma values in FULLENRICH_REQUEST_CONSTRAINTS in format {object}.{field} e.g. person.phones,company.employees
  - person
    - phones
    - linkedinLink
    - xLink
    - city
    - intro
    - jobTitle
  - company
    - employees
    - address

## ToDo
- update app once extending standard objects is possible
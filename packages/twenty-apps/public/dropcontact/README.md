# Dropcontact

Enrich People in Twenty with Dropcontact, and fill their Company with the employer data Dropcontact returns.

## What you get

- **People:** name, verified emails, mobile and landline phones, job title and LinkedIn on the standard fields, plus civility, job level, job function, country and how Dropcontact qualified the email. Emails Dropcontact marks as invalid are never written.
- **Companies:** the person's company is linked, or created when it doesn't exist yet. Its domain and LinkedIn are filled, plus industry and employee figures. For French companies there is also registry data: SIREN, SIRET, VAT, NAF code, registered address, turnover and net income.
- Run it from the command menu on selected people or as a workflow step. Each run can fill empty fields only, overwrite them, or return the data without writing anything.

## Matching

Dropcontact needs an email, a LinkedIn URL, or a first and last name together with the company name. The company's domain is sent along when the person is linked to one.

## Processing time

Dropcontact processes contacts in batches of up to 250 and can take a few minutes. A run waits about three and a half minutes for results. Contacts still being processed by then are marked **Pending**; run the enrichment again later to collect them. The batch is not resubmitted, so it isn't paid for twice.

## Billing

Billed to your Twenty credits for each contact Dropcontact returns a qualified email for, the same rule Dropcontact uses for its own credits. Contacts with no email found are free. See [SETUP.md](SETUP.md).

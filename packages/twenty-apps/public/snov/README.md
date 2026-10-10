# Snov.io

Enrich People and Companies in Twenty with Snov.io.

## What you get

- **People:** name, job title and LinkedIn on the standard fields, plus industry, location, current job start date, past jobs, social profiles and skills in Snov.io fields. The person's employer is linked, or created when it doesn't exist yet.
- **Missing emails:** for people without an email, Snov.io can find one from their first and last name and their company's domain. An email Snov.io verifies as deliverable is written to the person's emails. One with an unknown status is kept in the **Found Email** field instead. Turn this off with the **Find missing emails** setting.
- **Companies:** name, domain and city on the standard fields, plus industry, size, founded year, headquarters phone and related domains.
- Run it from the command menu on selected records or as a workflow step. Each run can fill empty fields only, overwrite them, or return the data without writing anything.

## Matching

- **People** are looked up by email first. Without an email, Snov.io finds one from the name and company domain. When neither works, the LinkedIn URL is used.
- **Companies** are looked up by their domain.

## Speed

Snov.io allows 60 API requests per minute. One lookup by email is one request, so a run reaches up to about 200 people with emails, and fewer when emails have to be found first. Records it doesn't reach in time come back as errors that say to run the enrichment again.

## Billing

Billed to your Twenty credits for the Snov.io credits each enrichment uses: one per profile or company found, and one per email found. Records Snov.io can't find are free. See [SETUP.md](SETUP.md).

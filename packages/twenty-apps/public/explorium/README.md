# Explorium

Enrich People and Companies in Twenty with Explorium data.

## What you get

- **People:** name, job title, LinkedIn, professional email and phone numbers on the standard fields, plus job levels, departments, skills, experience, education, location and email deliverability in Explorium fields. The person's employer is linked, or created when it doesn't exist yet.
- **Companies:** name, domain, LinkedIn and address on the standard fields, plus description, industry, employee and revenue ranges, NAICS and SIC codes, ticker and locations in Explorium fields.
- Run it from the command menu on selected records or as a workflow step. Each run can fill empty fields only, overwrite them, or return the data without writing anything.

## Matching

- **People** match on email or LinkedIn URL, or on full name together with the company name.
- **Companies** match on domain or LinkedIn URL. A company with only a name is skipped, because a name alone is too loose a match to write data onto.
- Once a record is matched, its Explorium ID is stored and reused, so later runs skip the match step.

## Billing

Billed to your Twenty credits from the Explorium credits each call reports. Records Explorium can't match cost nothing. Choose which contact details to fetch (professional email, phone numbers, both or neither) in the app's **Contact details** setting. It defaults to professional email only, since phones cost more Explorium credits. See [SETUP.md](SETUP.md).

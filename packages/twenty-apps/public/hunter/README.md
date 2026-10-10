# Hunter

Enrich People and Companies in Twenty with Hunter.

## What you get

- **People:** name, email, phone, job title and LinkedIn on the standard fields, plus bio, location, role, seniority, time zone and X, GitHub and Facebook profiles in Hunter fields. The person's employer is linked, or created when it doesn't exist yet, and filled with the company data Hunter returns alongside the person.
- **Missing emails:** for people without an email, Hunter can find one from their name and company, or from their LinkedIn profile. An email Hunter verifies as valid is written to the person's emails. Accept-all and unknown addresses are kept in the **Found Email** field with their score instead. Turn this off with the **Find missing emails** setting.
- **Companies:** name, domain, LinkedIn, address and exact revenue on the standard fields, plus industry, sector, SIC, NAICS and GICS codes, size, estimated revenue, funding, market cap, technologies, phone, social profiles and parent companies.
- Run it from the command menu on selected records or as a workflow step. Each run can fill empty fields only, overwrite them, or return the data without writing anything.

## Matching

- **People** with an email are enriched with Hunter's combined person and company lookup. Without one, Hunter first finds the email from the name and company domain (or company name) or the LinkedIn handle. When that's off or finds nothing, a LinkedIn handle is looked up directly.
- **Companies** are looked up by their domain.

## Billing

Billed to your Twenty credits for the Hunter credits each enrichment uses: one per email found, and 0.2 per person or company enriched when Hunter returns its core data. Records Hunter can't find are free. See [SETUP.md](SETUP.md).

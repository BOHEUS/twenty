# Enrichment

Shared Person and Company fields for enrichment provider apps. Install it once, and every provider app that depends on it writes the same data to the same fields instead of creating its own copy.

This app has no logic of its own. It only adds the fields below.

## Fields

**People:** location, job start date, skills, headline, bio, X, GitHub and Facebook profiles, LinkedIn connections, followers and username, data updated date, phone do-not-call flag, years of experience, job description, personal emails, interests and birth year.

**Companies:** description, tagline, founded year, employee count, keywords, total funding, latest funding date and amount, funding rounds, investors, ticker, phones, fax, other domains, email domain, legal name, other names, LinkedIn company ID and followers, and X, Facebook and Crunchbase profiles.

## What is not here

Only fields that hold the same kind of value in every provider are shared. These stay in each provider app for now:

- Fields that need one option list across providers, such as industry, seniority or size range.
- Fields that need one JSON shape, such as work history, education or funding rounds.
- Each provider's bookkeeping: its record ID, enrichment status, last enriched date and raw payload.

## For provider apps

Declare this app in `requiredApplications` and write to its fields by name through the records API. Your app's role decides whether it can write them. When two providers fill the same field, the last write wins.

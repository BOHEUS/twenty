# Enrichment

Shared Person and Company fields for enrichment provider apps. Install it once, and every provider app that depends on it writes the same data to the same fields instead of creating its own copy.

This app has no logic of its own. It only adds the fields below.

## Fields

**People:** location, job start date, skills, headline, bio, X, GitHub and Facebook profiles, LinkedIn connections, followers and username, data updated date, phone do-not-call flag, years of experience, job description, personal emails, interests and birth year. Seniority, department and email status use shared option lists; email confidence is a score from 0 to 100, and sub-departments are a list in each provider's wording. Work history, education, languages, other profiles, certifications and honors are stored as JSON.

**Companies:** description, tagline, founded year, employee count, keywords, total funding, latest funding date and amount, funding rounds, investors, ticker, phones, fax, other domains, email domain, legal name, other names, LinkedIn company ID and followers, and X, Facebook and Crunchbase profiles. Industry (LinkedIn's industry list), size range, company type, latest funding stage and operating status use shared option lists. Estimated revenue is stored as a minimum and maximum in USD, headcount growth as a 12-month percentage, the stock exchange as an ISO 10383 MIC code, and other industries and technologies as lists in each provider's wording. Parent company links to another Company, which lists its subsidiaries. SIC and NAICS codes are lists of codes. Other locations, headcount by department, funding round history, competitors and hiring activity are stored as JSON.

**Both:** enrichment status, last enriched date and the raw payload from the provider that last enriched the record.

JSON fields have no enforced schema, so each provider writes its own shape.

## What is not here

- Phone type, gender, HQ region and web traffic rank. Each provider keeps its own.
- Each provider's own record ID.

## For provider apps

Declare this app in `requiredApplications` and write to its fields by name through the records API. Your app's role decides whether it can write them. Map your values onto the shared option lists, and leave a field empty when a value has no match. When two providers fill the same field, the last write wins, including the status, last enriched date and raw payload.

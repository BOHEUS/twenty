# Twenty e2e Testing

## Prerequisite

If you want to contribute to the project on testing side, you have to know beforehand:

- TypeScript and OOP,
- HTML and XPath syntax,
- Playwright framework used for all testing,
- GraphQL and REST API,
- devtools in browsers,
- a bit of React in case something needs to be added to help find locators,
- and, of course, curiosity.

If that sounds a lot, that's the bare minimum, luckily there are lots of good resources for self-learning, most of them are contained in the [notes](https://github.com/twentyhq/twenty/issues/6641). 

Also, don't be afraid to ask whether something works as expected or not, it's better to ask rather than to assume.

## Commands

### Installing the browsers:
```
yarn playwright install 
```
### Run end-to-end tests
```
yarn run test:e2e
```
### Start the interactive UI mode
```
yarn run test:e2e:ui
```
### Run test only on Desktop Chrome
```
yarn run test:e2e:chrome
```
### Run test in specific file
```
yarn run test:e2e <filename>
```
### Runs the tests in debug mode.
```
yarn run test:e2e:debug
```

## Q&A

#### Why there's `path.resolve()` everywhere?
That's thanks to differences in root directory when running tests using commands and using IDE. When running tests with commands, 
the root directory is `twenty/packages/twenty-e2e-testing`, for IDE it depends on how someone sets the configuration. This way, it
ensures that no matter which IDE or OS Shell is used, the result will be the same.

#### Why HTML/CSS classes aren't used in Locators?
It's very simple, by default app uses theme from System settings (aka user's preferences set in OS) so one person uses light mode and 
the other uses dark mode, and we have no way of verifying who uses which mode (even though there's set dark mode in `playwright.config.ts`, 
someone can overwrite it). Also, most of the `<div>` components use only 1 class which changes depending on theme.

#### How can I check if my XPath is correct?
Go to devtools > Console, type `$x(XPath)`, e.g. `$x(button[@id='this_button'])` and check what console returns, if it returns anything other than 0,
that means your XPath is correct.
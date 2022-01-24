# Cool Cucumber

Run [Cucumber] tests from feature files with [Jest].

[Cucumber]: https://cucumber.io/
[Jest]: https://jestjs.io/

## Idea

You want to write wonderful feature files (in [Gherkin]),
but instead of using Cucumber's runner
you want to get all the nice feature from Jest
that you get for free with [create-react-app] or even [create-next-app].

[Gherkin]: https://cucumber.io/docs/gherkin/reference/
[create-react-app]: https://create-react-app.dev/
[create-next-app]: https://nextjs.org/docs/api-reference/create-next-app

## Implementation

Jest can use custom transforms
to read files it cannot parse on its own.
This library is a custom transform for `.feature` files.

As it uses official cucumber libraries,
it should be able to parse pretty much all valid feature files.
Here is a probably outdated list of things it generates:

- `Feature`s become `describe` blocks
- `Example`s/`Scenario`s become `test` blocks
- `Given`, `When`, `Then`, `And`, `*`, `But` is supported of course
- `Scenario Outline`s are instantiated for all their examples as `test` blocks as well
- If a `Background` is present, it is include in all the affected scenarios
- Data Tables are supported
- Expressions are supported
- `@skip` tag will (you guessed it) skip the feature/scenario

Not implement/tested:

- Before/After hooks are not supported yet
- Custom tags are included as (invisible) comments only for now
- Doc Strings have not been tested
- `Rule`s have not been tested

## Usage

Add this library as a dependency.
Also add `@cucumber/cucumber` and `@cucumber/messages` which are needed at runtime.

### Config

You'll need to extend your `jest.config.js`:

- Add the file(s) that have your step definitions to `setupFilesAfterEnv`
- Add `feature` to the `moduleFileExtensions`
- Add `"\\.feature$": 'cool-cucumber',` to `transform`
- Add something like `"<rootDir>/features/*.feature",` to `testMatch`

You can find an example based on Next.js' jest config in `example-nextjs/jest.config.js`.

### Step definition

You define your steps as usual for Cucumber,
but at the very beginning you'll need to add this:

```ts
import { default as supportCodeLibraryBuilder } from "@cucumber/cucumber/lib/support_code_library_builder";
import { uuid } from "@cucumber/messages/dist/src/IdGenerator";
supportCodeLibraryBuilder.reset(process.cwd(), uuid());
```

This is for some reason the only stable way to initialize Cucumber
so that it can find all steps and refer to them later on
in the generated code.

## Inspiration

This library is inspired by [cucumber-jest],
which solves this problem in a very similar way.
[cucumber-jest] is written by Dayne Mentier and licensed under the MIT license.

The reasons I have not used/extended this instead is
that it seems to run each step in a Jest `test` block,
which breaks jsdom or at least makes it less convenient to use.
It also created the Jest tests at runtime.
You can see this library here as an experimental alternative implementation.
I have not copied any of its code, and only used it as inspiration/reference.

[cucumber-jest]: https://github.com/mainfraame/cucumber-jest


## License

Licensed under either of

 * Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally
submitted for inclusion in the work by you, as defined in the Apache-2.0
license, shall be dual licensed as above, without any additional terms or
conditions.

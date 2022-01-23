# Dev log

The following are quick notes I took while building this lib.

## Before the code

What do I want?
- Use cucumber for integration tests
  - app is TS Graphql backend + Next.js frontend
  - Mono-repo pain included
- Make it pleasant to use for other devs
  - So people actually end up using it
- Base this on jest
  - included in next's default setup
  - good documentation out there

Existing solutions:
- [jest-cucumber](https://github.com/bencompton/jest-cucumber)
  - no thank you: you need to manually ensure your test matches your feature file
    - manual work leads to errors and annoyance
    - makes sharing steps uncomfortable
- cucumber-jest: I [forked](https://github.com/technocreatives/cucumber-jest) it
  - right approach
    - enables jest to loads feature files as test files
    - good readme
  - issues with newer versions
    - doesn't work with default setup from next 12
    - this is half a year old and already outdated, wow
  - Problem: Issues with jsdom?
    - Seems like I can't easily render a component and then check for it in another step
    - Can I assign the document or render output to the world and circumvent the issue?
      - Maybe but goes against the goal of making this fun to use
  - Digging deeper
    - They turn Scenarios into jest test blocks
    - But: Each step is its own `it` block!
      - Neat approach, but is noisy and probably the cause why jsdom doesn't work
  - tl;dr let's learn from this

## Planning the work

Steps to success
1. Write a super simple [transform](https://jestjs.io/docs/code-transformation) that we can add to our jest config
2. Have it read `.feature` files, e.g. using [gherkin-stream](https://www.npmjs.com/package/@cucumber/gherkin-streams)
3. Generate jest tests from the gherkin events
4. Make beautiful error messages and maybe a mode to generate stub code

What do I call this?
- cucumber-jest and jest-cucumber are both taking
  - Also boring
- Looking at swedish words makes me assume that anything with gurka and skoj will be read as a penis joke
- Codename: cool-cucumber
  - Better name later
  - Maybe align with Brendan's Rust crate names of sensible

How to get going?
- Let's set up two packages
  1. test nextjs app
  2. Our lib
- Monorepos in JS land are… not fun
  - Maybe just symlink our lib into the test app
  - Or try projects references in tsconfig

## Coding time

Let's add the gherkin-stream thing to our lib and see what it gives us
- Write example feature file
- Node streams, how do they work?
  - add the usual `.on` handlers and see what falls out of it
- `GherkinStreams.fromPaths` can't deal with directories, you have to give it file paths.
- the callback in `.on('data', callback)` is given `any`, thanks
  - It's an `Envelope` from `@cucumber/messages`, guess I'm gonna add that dependency for types at least
  - That `Envelope` type is not an enum, just a thing with optional fields, terrific.
    Gonna name them by the field they have from now on.
- Alright, my `example.feature` gives me three messages
  1. `source`, containing the plain text of my file
  2. `gherkinDocument`, the AST representation of my file
  3. `pickle`, which I assume are the individual and resolved examples
- Challenges from this:
  - Do I ned to care about anything but pickles?
  - How to map this to jest's `test` and `describe`?
- Gonna have to make the example more complex to see what the pickles will become
  - Test: Background, Scenario outline, data tables, tags
  - Results
    - Background and scenario outlines are resolved in pickles, I don't have to think about them
    - Data tables are inlined in pretty much their AST, I'll have to turn it into a nice hashmap myself I guess
    - Tags are just arrays of strings

Let's look at integrating this with jest from nextjs
- We follow [the docs](https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler)
  - installing dependencies and creating the config file
  - create example file (but as `.tsx`), and also add `@types/jest` dependency
  - Oh wait, we didn't set up next with typescript. How is that not the default? Jesus. Let's redo that part.
- Make our lib export a thing that works as a [Jest transform](https://jestjs.io/docs/code-transformation#examples)
  - Going for code that doesn't require typescript for now as a precaution
  - Configuring jest to look at feature files and call cool-cucumber
  - Adding dummy feature that looks very much like the other jest test we just pasted it
  - 20min later: Also add `feature` to `moduleFileExtensions`
- Made the whole lib a typescript project that can be built and installed
  - lib has a build step (just `tsc` really)
  - test app now has `"cool-cucumber": "file:../lib"` dependency

Sync vs Async transforms
- So I get a stream of messages from gherkin-stream, which I can use in an async context
- Jest docs say there's `SyncTransformer` and `AsyncTransformer` and I can implement either
- And yet it complains when I implement `AsyncTransformer`
  - digging thru jest issues I find [#11458](https://github.com/facebook/jest/issues/11458) but don't see any good solution
- cucumber-jest code that parses the feature file at runtime it seems
- Okay, we don't use `gherkin-stream`: the `gherkin` package does the same and is synchronous! Crisis averted.
- So now we have
  1. jest calling our transform
  2. A gherkin file being parsed
  3. A working empty string output!

Codegen time!
- Iterate thru all pickle messages and build jest-like code for them
  - This is just busy work
  - Assume that our lib is called per feature file
  - Data table transform in ~10 lines of code, very nice
- Error handling:
  - Are Jest errors documented somewhere? By default it points to the beginning of the feature file
  - Minimum cases
    1. feature file parse error: when first message has an `attachment` and no `gherkinDocument`
    2. Missing steps: ???
      - Would be amazing to generate boilerplate

Challenge: How to invoke cucumber steps?
- We have empty test functions in the right order, great.
- What is needed to run cucumber?
  - Init world
    - On each example, I assume?
  - Call steps
- First off: tell jest to load steps from a file

SupportCodeLibraryBuilder
- So there is a thing in `@cucumber/cucumber/lib/support_code_library_builder` that cucumber-jest uses
  - It seems to be able to collect all the global definitions of the cucumber steps etc
  - The default export is an instance of the class
- Got some issues using it in my codegen in a call to `getDefinitionLineAndUri`
  - `cwd` is undefined
  - This is from the steps definition!
  - `SupportCodeLibraryBuilder` only sets `cwd` in its reset function -- oops! We need to call that I guess.
    - gonna aggressively call it in steps setup for now
    - FIXME: proper setup code
- getting arguments from steps
  - Pattern: apply step text to the step's expression and get params
  - Assumption: Data table is last argument
  - There's also doc strings but I don't yet what it does
- I can run tests!
- Note to self: `JSON.stringify` is great for injecting JS strings into JS source!

Next up:
1. Caching
2. Error messages that don't suck
3. Test the rest of the features

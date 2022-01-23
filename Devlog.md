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


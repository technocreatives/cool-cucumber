import { Given, When, Then } from "@cucumber/cucumber";
import { default as supportCodeLibraryBuilder } from '@cucumber/cucumber/lib/support_code_library_builder';
import { uuid } from '@cucumber/messages/dist/src/IdGenerator';

supportCodeLibraryBuilder.reset(process.cwd(), uuid());


Given("I have a calculator", function () { console.log("I have a calculator", arguments) })
Given("x is {int}", function (x: number) { console.log("x is {int}", arguments) })
When("I add {int} to it", function (y: number) { console.log("I add {int} to it", arguments) })
Then("x should be {int}", function (res: number) { console.log("x should be {int}", arguments) })
Then("x is not {int}", function (res: number) { console.log("x is not {int}", arguments) })
Given("I have these buttons", function () { console.log("I have these buttons", arguments) })

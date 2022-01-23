import { Given, When, Then } from "@cucumber/cucumber";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

import { default as supportCodeLibraryBuilder } from "@cucumber/cucumber/lib/support_code_library_builder";
import { uuid } from "@cucumber/messages/dist/src/IdGenerator";
supportCodeLibraryBuilder.reset(process.cwd(), uuid());

Given("I am on the home page", async function () {
  render(<Home />);
});

When("I look at it real close", function () {
  console.log("Looooking");
});

Then("it says {string}", async function (res: string) {
  expect.assertions(1);
  await new Promise((resolve, reject) => {
    const heading = screen.getByRole("heading", {
      name: new RegExp(res, "i"),
    });
    console.log("there it is");

    expect(heading).toBeInTheDocument();
    resolve(true);
  });
});

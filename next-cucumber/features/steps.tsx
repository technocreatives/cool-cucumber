import { Given, When, Then } from "@cucumber/cucumber";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

import { default as supportCodeLibraryBuilder } from "@cucumber/cucumber/lib/support_code_library_builder";
import { uuid } from "@cucumber/messages/dist/src/IdGenerator";
supportCodeLibraryBuilder.reset(process.cwd(), uuid());

Given("I am on the home page", function () {
  render(<Home />);
});

When("I look at it real close", function () {
  console.log("Looooking");
});

Then("it says {string}", function (res: string) {
  const heading = screen.getByRole("heading", {
    name: new RegExp(res, "i"),
  });

  expect(heading).toBeInTheDocument();
});

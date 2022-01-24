import { readFileSync } from "fs";
import { SourceMediaType, IdGenerator } from "@cucumber/messages";
import { generateMessages } from "@cucumber/gherkin";

const options = {
  includeSource: true,
  includeGherkinDocument: true,
  includePickles: true,
  relativeTo: process.cwd(),
  newId: IdGenerator.uuid(),
}

const testFilePath = `${__dirname}/example.feature`;

const messages = generateMessages(readFileSync(testFilePath, 'utf-8'), testFilePath, SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN, options)
console.log(JSON.stringify(messages, null, 2));

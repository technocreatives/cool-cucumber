import { generateMessages } from "@cucumber/gherkin";
import { IdGenerator, SourceMediaType } from "@cucumber/messages";
import type { SyncTransformer } from "@jest/transform";
console.log('hello cucumber');

interface Options { }

const transformer: SyncTransformer<Options> = {
  process(sourceText, sourcePath, options) {
    console.log("yes hello")

    const messages = generateMessages(sourceText, sourcePath, SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN, {
      includePickles: true,
      // includeGherkinDocument: true, // include this to access AST
      // includeSource: true, // include this to refer to source e.g. in error messages
      newId: IdGenerator.uuid(),
    })

    console.log(JSON.stringify(messages, null, 2))

    return "";
  },
};

export default transformer;

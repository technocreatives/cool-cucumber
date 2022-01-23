import { generateMessages } from "@cucumber/gherkin";
import { IdGenerator, SourceMediaType } from "@cucumber/messages";
import type { SyncTransformer } from "@jest/transform";
import featureToJestTest from "./test-gen";

interface Options { }

const transformer: SyncTransformer<Options> = {
  process(sourceText, sourcePath, options) {
    const messages = generateMessages(sourceText, sourcePath, SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN, {
      includePickles: true,
      includeGherkinDocument: true, // include this to access AST
      includeSource: true, // include this to refer to source e.g. in error messages
      newId: IdGenerator.uuid(),
    })

    const res = featureToJestTest(messages);
    console.log(res);
    return res;
  },
};

export default transformer;

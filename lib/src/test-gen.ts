import {
  Envelope,
  GherkinDocument,
  Pickle,
  PickleStep,
  PickleTable,
} from "@cucumber/messages";

export default function featureToJestTest(
  messages: readonly Envelope[]
): string {
  const documents = messages.filter((message) => message.gherkinDocument);
  if (documents.length !== 1) {
    throw new Error(
      `Expected exactly 1 gherkin document from 1 file, got ${documents.length}`
    );
  }
  const ast = documents[0].gherkinDocument as GherkinDocument;
  const feature = ast.feature;
  if (!feature) {
    throw new Error(`Expected a feature to be in gherkin document`);
  }

  const pickles = messages
    .filter((message) => message.pickle)
    .map((message) => message.pickle) as Pickle[];
  console.debug(`found ${pickles.length} pickles`);
  const tests = pickles.map(pickleToTest);

  return `// intermediate code generated by cool-cucumber

    describe("${feature.name}", () => {
      ${tests.join("\n")}
    })
  `;
}

function pickleToTest(pickle: Pickle): string {
  const steps = pickle.steps.map(callSteps);

  return `
    // tags: ${pickle.tags.join(", ")}
    test("${pickle.name}", async () => {
      ${steps.join("\n")}
    });
  `;
}

function callSteps(step: PickleStep): string {
  const data = dataTableToMap(step.argument?.dataTable);

  return `
    // ${step.text}
    expect(() => {
      const data = ${JSON.stringify(data)};
      // FIXME: call step here
    }).not.toThrow();
  `;
}

function dataTableToMap(table: PickleTable | undefined): Array<Record<string, string>> {
  const header = table?.rows[0];
  if (!header) { return []; }

  const fields = header.cells.map((cell) => cell.value);
  return table.rows
    .slice(1)
    .map((row) =>
      Object.fromEntries(
        row.cells.map((cell, idx) => [fields[idx], cell.value])
      )
    );
}

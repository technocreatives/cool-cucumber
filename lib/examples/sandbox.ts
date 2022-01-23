import { GherkinStreams } from '@cucumber/gherkin-streams';
import { Envelope } from "@cucumber/messages";

const paths = [`${__dirname}/example.feature`];
const options = {
  includeSource: true,
  includeGherkinDocument: true,
  includePickles: true,
  relativeTo: process.cwd()
}
const stream = GherkinStreams.fromPaths(paths, options)

stream.on('error', (e) => {
  console.error(e);
  process.exit(1);
})

stream.on('end', () => {
  console.info('done');
  process.exit(0);
})

stream.on('data', (item: Envelope) => {
  console.log(item);
})

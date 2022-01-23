import { default as supportCodeLibraryBuilder } from '@cucumber/cucumber/lib/support_code_library_builder';
import { uuid } from '@cucumber/messages/dist/src/IdGenerator';

// TODO: Figure out why calling this doesn't work
export default function init(cwd: string) {
  supportCodeLibraryBuilder.reset(cwd, uuid());
}

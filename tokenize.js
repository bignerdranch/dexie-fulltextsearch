import lunr from 'lunr';
import { cleanDiacritics } from 'underscore.string';

export let index = lunr(() => {});
index.pipeline.remove(lunr.stopWordFilter);

export default (text) =>
  index.pipeline.run(
    lunr.tokenizer(
      cleanDiacritics(text))
  ).map(t => t.toString())

import intersection from './utils';
import intersect from './intersect';
import tokenize from './tokenize';

let tokensFor = (fields, object) => {
  fields = intersection(fields, Object.keys(object));

  let string = fields.map(field => {
    let value = object[field];
    if (typeof value === 'string') {
      return value;
    }
  }).join(' ');

  return tokenize(string);
};

export let addFullText = (table, tokenField, fields) => {
  table.hook('creating', (_, obj) => {
    obj[tokenField] = tokensFor(fields, obj);
  });

  table.hook('updating', (mods, _, obj) => {
    return { [tokenField]: tokensFor(fields, { ...obj, ...mods }) };
  });
}

export default async (table, tokenField, query) => {
  let tokens = tokenize(query);
  let queries = tokens.map(token =>
    table.where(tokenField).startsWith(token));

  return await intersect(table, queries);
}

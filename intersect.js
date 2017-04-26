export default async (table, queries) => {
  let results = await Promise.all(
    queries.map(q => q.primaryKeys()));

  let reduced = results
    .reduce((a, b) => {
      let set = new Set(b);
      return a.filter(k => set.has(k));
    });

  return table.where(':id').anyOf(reduced);
};

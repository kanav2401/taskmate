export const paginate = async (
  model,
  query,
  page = 1,
  limit = 8,
  populate = "",
  sort = { createdAt: -1 }
) => {
  const currentPage = parseInt(page);
  const perPage = parseInt(limit);

  const skip = (currentPage - 1) * perPage;

  const total = await model.countDocuments(query);

  const data = await model
    .find(query)
    .populate(populate)
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  return {
    data,
    total,
    page: currentPage,
    totalPages: Math.ceil(total / perPage),
    limit: perPage,
  };
};
const getProductStatus = (quantity, allocated, minStock) => {
  const available = quantity - allocated;

  let status = "IN_STOCK";

  if (available <= 0) {
    status = "OUT_OF_STOCK";
  } else if (available <= minStock) {
    status = "LOW_STOCK";
  }

  return {
    available,
    status
  };
};

module.exports = { getProductStatus };

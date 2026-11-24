const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Custom API Error Helper
 */
class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// ---------------- CREATE QUERY ----------------
const createQuery = async (data) => {
  const { title, description, priority, employeeId, assetId } = data;

  if (!title || !description || !employeeId) {
    throw new ApiError(
      400,
      "QRY_001",
      "Missing required fields (title, description, employeeId)"
    );
  }

  return prisma.query.create({
    data: {
      title,
      description,
      priority,
      employeeId,
      assetId
    }
  });
};

// ---------------- GET ALL QUERIES ----------------
const getAllQueries = async (filters) => {
  const { status, priority, search } = filters;

  const queries = await prisma.query.findMany({
    where: {
      status: status || undefined,
      priority: priority || undefined,
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
          ]
        : undefined
    },
    include: {
      employee: { select: { name: true } },
      asset: {
        include: {
          product: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return queries.map((q) => ({
    ...q,
    employee: q.employee?.name || "Unknown Employee",
    asset: q.asset?.product?.name || "Unknown Asset",
    date: q.createdAt ? new Date(q.createdAt).toISOString().split("T")[0] : "-"
  }));
};

// ---------------- GET QUERY BY ID ----------------
const getQueryById = async (id) => {
  const query = await prisma.query.findUnique({ where: { id } });

  if (!query) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }

  return query;
};

// ---------------- UPDATE QUERY ----------------
const updateQuery = async (id, data) => {
  try {
    return await prisma.query.update({
      where: { id },
      data
    });
  } catch (error) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }
};

// ---------------- UPDATE QUERY STATUS ----------------
const updateQueryStatus = async (id, status) => {
  if (!["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
    throw new ApiError(400, "QRY_002", "Invalid status value");
  }

  try {
    return await prisma.query.update({
      where: { id },
      data: { status }
    });
  } catch (error) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }
};

// ---------------- DELETE QUERY ----------------
const deleteQuery = async (id) => {
  try {
    return await prisma.query.delete({
      where: { id }
    });
  } catch (error) {
    throw new ApiError(404, "QRY_404", "Query not found");
  }
};

module.exports = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQuery,
  updateQueryStatus,
  deleteQuery,
  ApiError
};

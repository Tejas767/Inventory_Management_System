const prisma = require("../config/prisma");

/**
 * Find the Employee record linked to a logged-in User.
 * Matches by userId first, then falls back to email (auto-linking userId if unset).
 *
 * @param {object} user - Authenticated user payload ({ id, email, role })
 * @returns {Promise<object|null>} Linked Employee record or null
 */
async function findLinkedEmployee(user) {
  if (!user) return null;

  let employee = await prisma.employee.findFirst({
    where: { userId: user.id },
  });

  if (!employee && user.email) {
    employee = await prisma.employee.findUnique({
      where: { email: user.email },
    });

    // Auto-link employee to user account on first match
    if (employee && !employee.userId) {
      employee = await prisma.employee.update({
        where: { id: employee.id },
        data: { userId: user.id },
      });
    }
  }

  return employee;
}

module.exports = { findLinkedEmployee };

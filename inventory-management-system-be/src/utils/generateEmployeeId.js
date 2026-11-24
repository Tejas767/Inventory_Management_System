
module.exports = (employeeNo) => {
  return `EMP-${String(employeeNo).padStart(3, "0")}`;
};


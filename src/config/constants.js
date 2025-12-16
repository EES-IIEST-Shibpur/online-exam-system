// src/config/constants.js
// Central place for domain constants to avoid magic values.

const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
};

const ATTEMPT_STATUS = {
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  EXPIRED: 'expired',
};

module.exports = {
  ROLES,
  ATTEMPT_STATUS,
};

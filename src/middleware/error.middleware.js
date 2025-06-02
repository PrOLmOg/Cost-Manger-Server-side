/**
 * Global error-handling middleware.
 *
 * Logs the error and returns JSON `{ message }` with status&nbsp;500.
 *
 * @category Middleware
 * @param {Error}                        err   - The error object
 * @param {import('express').Request}    _req  - Express request (unused)
 * @param {import('express').Response}   res   - Express response
 * @param {import('express').NextFunction} _next - Next middleware (unused)
 * @returns {void}
 */
export const errorHandler = (err, _req, res, _next) => {
  console.error(err); // Log error details to the console
  res.status(500).json({ message: err.message }); // Send error response
};

const pkg = require('../package.json');

/**
 * Return the current package version.
 *
 * @returns {string} the version string from package.json
 */
const version = () => pkg.version;

/**
 * Build a greeting for the given name.
 *
 * @param {string} [name] the name to greet; falls back to "world" when empty
 * @returns {string} the greeting message
 */
const greet = (name) => `Hello, ${name || 'world'}!`;

module.exports = { version, greet };

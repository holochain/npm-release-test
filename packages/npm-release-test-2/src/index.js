const pkg = require('../package.json');

const version = () => pkg.version;

const greet = (name) => `Hello from package 2, ${name || 'world'}!`;

module.exports = { version, greet };

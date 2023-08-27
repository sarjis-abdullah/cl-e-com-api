const fs = require('fs');

// Get the resource name from the command-line arguments
const resourceName = process.argv[2];

if (!resourceName) {
  console.error('Please provide a resource name (e.g., "brand", "stock", "product").');
  process.exit(1);
}

// Define the template content for controller and middleware files
const controllerTemplate = `
// ${resourceName}Controller.js
const ${resourceName}Controller = {
  // Your controller methods for ${resourceName} go here
};

module.exports = ${resourceName}Controller;
`;

const middlewareTemplate = `
// ${resourceName}Middleware.js
const ${resourceName}Middleware = {
  // Your middleware methods for ${resourceName} go here
};

module.exports = ${resourceName}Middleware;
`;
const modelTemplate = `
// ${resourceName}Middleware.js
const ${resourceName}Middleware = {
  // Your middleware methods for ${resourceName} go here
};

module.exports = ${resourceName}Middleware;
`;
const routesTemplate = `
// ${resourceName}Middleware.js
const ${resourceName}Middleware = {
  // Your middleware methods for ${resourceName} go here
};

module.exports = ${resourceName}Middleware;
`;

// Create controller and middleware files
fs.writeFileSync(`./app/controllers/${resourceName}Controller.js`, controllerTemplate);
fs.writeFileSync(`./app/middlewares/${resourceName}Middleware.js`, middlewareTemplate);
fs.writeFileSync(`./app/models/${resourceName}Model.js`, modelTemplate);
fs.writeFileSync(`./app/routes/${resourceName}Routes.js`, routesTemplate);

console.log(`Files created: ${resourceName}Controller.js and ${resourceName}Middleware.js`);

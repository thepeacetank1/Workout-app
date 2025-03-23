/**
 * This test checks that all required imports in key files actually resolve to existing files
 * It recursively scans the src directory for all JavaScript and TypeScript files
 * and validates their imports to prevent "Module not found" errors
 */

const fs = require('fs');
const path = require('path');

// Helper function to read a file and extract import statements
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Match import statements - this is a simplified regex that catches most import formats
    const importRegex = /import\s+(?:{[^}]+}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
    
    const imports = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        path: match[1],
        fullImportStatement: match[0]
      });
    }
    return imports;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
    return [];
  }
}

// Helper function to resolve import paths
function resolveImportPath(importPath, currentFilePath) {
  const basePath = path.dirname(currentFilePath);
  
  // Handle relative imports
  if (importPath.startsWith('.')) {
    // If no extension specified, try common extensions
    if (!path.extname(importPath)) {
      const extensions = ['.js', '.jsx', '.ts', '.tsx'];
      for (const ext of extensions) {
        const fullPath = path.resolve(basePath, `${importPath}${ext}`);
        if (fs.existsSync(fullPath)) {
          return { exists: true, path: fullPath };
        }
      }
      
      // Check if it's a directory with an index file
      const dirPath = path.resolve(basePath, importPath);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const extensions = ['.js', '.jsx', '.ts', '.tsx'];
        for (const ext of extensions) {
          const indexPath = path.join(dirPath, `index${ext}`);
          if (fs.existsSync(indexPath)) {
            return { exists: true, path: indexPath };
          }
        }
      }
    } else {
      // Extension is specified
      const fullPath = path.resolve(basePath, importPath);
      return { exists: fs.existsSync(fullPath), path: fullPath };
    }
    
    // If we get here, the import couldn't be resolved
    return { exists: false, path: path.resolve(basePath, importPath) };
  }
  
  // For non-relative imports, we need to check if they're node modules
  // or from src directories that should be properly set up
  if (importPath.startsWith('@')) {
    // Handle aliased imports - adjust based on your webpack/tsconfig paths
    return { exists: true, path: importPath }; // Assume configuration is correct
  }
  
  // For regular node modules imports
  return { exists: true, path: importPath };
}

// Function to recursively get all files in a directory
function getAllFiles(dirPath, extensions, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        arrayOfFiles = getAllFiles(filePath, extensions, arrayOfFiles);
      }
    } else {
      const fileExt = path.extname(file);
      if (extensions.includes(fileExt)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

describe('File Import Tests', () => {
  // Key files that should be tested for import validity
  const keyFiles = [
    path.resolve(__dirname, '../index.tsx'),
    path.resolve(__dirname, '../App.jsx'),
    path.resolve(__dirname, '../App.tsx'),
    // Add other important files here that must be tested individually
  ];

  test.each(keyFiles)('All imports in key file %s should resolve to existing files', (filePath) => {
    // Skip files that don't exist (might be .tsx vs .jsx)
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping non-existent file: ${filePath}`);
      return;
    }
    
    const imports = extractImports(filePath);
    const failedImports = [];
    
    for (const importItem of imports) {
      const importPath = importItem.path;
      // Skip node module imports and CSS imports
      if (!importPath.startsWith('.') || importPath.endsWith('.css')) {
        continue;
      }
      
      const resolution = resolveImportPath(importPath, filePath);
      if (!resolution.exists) {
        failedImports.push({
          importPath,
          fullStatement: importItem.fullImportStatement,
          resolvedPath: resolution.path
        });
      }
    }
    
    if (failedImports.length > 0) {
      console.error(`Failed imports in ${filePath}:`, failedImports);
    }
    
    expect(failedImports).toEqual([]);
  });
  
  test('All imports in src directory should resolve to existing files', () => {
    const srcPath = path.resolve(__dirname, '..');
    const fileExtensions = ['.js', '.jsx', '.ts', '.tsx'];
    const allFiles = getAllFiles(srcPath, fileExtensions);
    
    const allFailedImports = {};
    let totalFailedImports = 0;
    
    for (const filePath of allFiles) {
      // Skip test files themselves to avoid test-on-test dependencies
      if (filePath.includes('test') || filePath.includes('__tests__')) {
        continue;
      }
      
      const imports = extractImports(filePath);
      const fileFailedImports = [];
      
      for (const importItem of imports) {
        const importPath = importItem.path;
        // Skip node module imports and CSS imports
        if (!importPath.startsWith('.') || importPath.endsWith('.css')) {
          continue;
        }
        
        const resolution = resolveImportPath(importPath, filePath);
        if (!resolution.exists) {
          fileFailedImports.push({
            importPath,
            fullStatement: importItem.fullImportStatement,
            resolvedPath: resolution.path
          });
        }
      }
      
      if (fileFailedImports.length > 0) {
        allFailedImports[filePath] = fileFailedImports;
        totalFailedImports += fileFailedImports.length;
      }
    }
    
    if (totalFailedImports > 0) {
      console.error(`Found ${totalFailedImports} import errors across ${Object.keys(allFailedImports).length} files:`);
      console.error(JSON.stringify(allFailedImports, null, 2));
    }
    
    expect(totalFailedImports).toBe(0);
  });
});

/* Define the ProcessEnv and Process interfaces to augment global types and include API_KEY */
interface ProcessEnv {
  API_KEY: string;
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
}

// Fixed: Removed 'declare var process: Process;' because 'process' is already declared in the global scope 
// (likely by Node.js types or the development environment) and cannot be redeclared. 
// Interface merging for 'Process' and 'ProcessEnv' above ensures the existing 'process' variable 
// has the correct type definitions.

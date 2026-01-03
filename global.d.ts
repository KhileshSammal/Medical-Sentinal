
/* Define the ProcessEnv and Process interfaces to augment global types and include API_KEY */
interface ProcessEnv {
  API_KEY: string;
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
}

/* Redeclare the global process variable using the Process interface to avoid type mismatches and block-scope conflicts */
declare var process: Process;

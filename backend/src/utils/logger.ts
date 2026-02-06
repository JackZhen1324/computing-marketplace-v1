type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

const logger = {
  info: (message: string, meta?: any) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  },
  warn: (message: string, meta?: any) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  },
  debug: (message: string, meta?: any) => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  },
};

function shouldLog(level: LogLevel): boolean {
  const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
  return levels.indexOf(level) <= levels.indexOf(logLevel as LogLevel);
}

export default logger;

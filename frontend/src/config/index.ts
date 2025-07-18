// Configuration exports
import { AppConfig } from './AppConfig';

export { AppConfig } from './AppConfig';
export { config as env, envConfig } from './env';

// Lazy configuration instance getter to avoid circular dependencies
export const getAppConfig = () => AppConfig.getInstance();
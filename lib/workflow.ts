import { requireQstashToken, requireQstashUrl } from './config.server';
import { Client as WorkflowClient } from '@upstash/workflow';

export const workflowClient = new WorkflowClient({
  baseUrl: requireQstashUrl(),
  token: requireQstashToken(),
});

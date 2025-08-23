import {
  requireQstashToken,
  requireQstashUrl,
  requireResendToken,
} from './config.server';
import { Client as WorkflowClient } from '@upstash/workflow';
import { Client as QStashClient, resend } from '@upstash/qstash';

export const workflowClient = new WorkflowClient({
  baseUrl: requireQstashUrl(),
  token: requireQstashToken(),
});

const qstashClient = new QStashClient({ token: requireQstashToken() });

export const sendEmail = async ({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) => {
  await qstashClient.publishJSON({
    api: {
      name: 'email',
      provider: resend({ token: requireResendToken() }),
    },
    body: {
      from: 'Kanat <hello.kanatosmon.com>',
      to: [email],
      subject,
      html: message,
    },
  });
};

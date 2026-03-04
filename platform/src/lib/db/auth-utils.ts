import { createHash, randomBytes } from 'node:crypto';
import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { doc, TABLE_NAME } from './client';
import type { ApiKey, MagicLinkToken, RemediationRequest } from './types';

// API Key operations
export async function createApiKey(
  userId: string,
  name: string
): Promise<{ key: string; apiKeyId: string }> {
  const apiKeyId = randomBytes(16).toString('hex');
  const rawKey = `ar_${randomBytes(32).toString('hex')}`;
  const keyHash = createHash('sha256').update(rawKey).digest('hex');
  const prefix = `${rawKey.substring(0, 7)}...`;

  const item: ApiKey = {
    id: apiKeyId,
    userId,
    name,
    keyHash,
    prefix,
    createdAt: new Date().toISOString(),
  };

  const dbItem = {
    PK: `USER#${userId}`,
    SK: `APIKEY#${apiKeyId}`,
    GSI1PK: 'APIKEYS',
    GSI1SK: keyHash,
    ...item,
  };
  await doc.send(new PutCommand({ TableName: TABLE_NAME, Item: dbItem }));
  return { key: rawKey, apiKeyId };
}

export async function listUserApiKeys(userId: string): Promise<ApiKey[]> {
  const result = await doc.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'APIKEY#',
      },
    })
  );
  return result.Items as ApiKey[];
}

export async function deleteApiKey(
  userId: string,
  apiKeyId: string
): Promise<void> {
  await doc.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: `USER#${userId}`, SK: `APIKEY#${apiKeyId}` },
    })
  );
}

// Magic Link operations
export async function createMagicLinkToken(email: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
  const item: MagicLinkToken = {
    token,
    email,
    expiresAt,
    used: false,
    createdAt: new Date().toISOString(),
  };
  await doc.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { PK: `MAGIC#${token}`, SK: '#METADATA', ...item },
    })
  );
  return token;
}

// Remediation operations
export async function createRemediations(
  repoId: string,
  requests: RemediationRequest[]
): Promise<void> {
  for (const req of requests) {
    const item = {
      PK: `REPO#${repoId}`,
      SK: `REMEDIATION#${req.id}`,
      GSI2PK: `REMEDIATION#${repoId}`,
      GSI2SK: req.createdAt,
      ...req,
    };
    await doc.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  }
}

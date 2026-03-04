import {
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { doc, TABLE_NAME } from './client';
import type { Repository } from './types';

export async function createRepository(repo: Repository): Promise<Repository> {
  const now = new Date().toISOString();
  const item = {
    PK: `REPO#${repo.id}`,
    SK: '#METADATA',
    GSI1PK: repo.teamId ? `TEAM#${repo.teamId}` : `USER#${repo.userId}`,
    GSI1SK: `REPO#${repo.id}`,
    ...repo,
    createdAt: repo.createdAt || now,
    updatedAt: now,
  };
  await doc.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  return repo;
}

export async function getRepository(
  repoId: string
): Promise<Repository | null> {
  const result = await doc.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: `REPO#${repoId}`, SK: '#METADATA' },
    })
  );
  return result.Item ? (result.Item as Repository) : null;
}

export async function listUserRepositories(
  userId: string
): Promise<Repository[]> {
  const result = await doc.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'REPO#',
      },
      ScanIndexForward: false,
    })
  );
  return (result.Items || []) as Repository[];
}

export async function listTeamRepositories(
  teamId: string
): Promise<Repository[]> {
  const result = await doc.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `TEAM#${teamId}`,
        ':prefix': 'REPO#',
      },
      ScanIndexForward: false,
    })
  );
  return (result.Items || []) as Repository[];
}

export async function deleteRepository(repoId: string): Promise<void> {
  await doc.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: `REPO#${repoId}`, SK: '#METADATA' },
    })
  );
}

export async function updateRepositoryScore(
  repoId: string,
  score: number
): Promise<void> {
  await doc.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: `REPO#${repoId}`, SK: '#METADATA' },
      UpdateExpression: 'SET aiScore = :s, lastAnalysisAt = :t, updatedAt = :t',
      ExpressionAttributeValues: {
        ':s': score,
        ':t': new Date().toISOString(),
      },
    })
  );
}

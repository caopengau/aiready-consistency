import { getLatestAnalysis } from '../src/lib/db/analysis';
import { getAnalysis } from '../src/lib/storage';

async function test() {
  const repoId = '86687a20-2aef-4684-a296-bb8bea4b3b6f';
  const analysis = await getLatestAnalysis(repoId);
  const rawKey = (analysis as any).rawKey;
  const raw = (await getAnalysis(rawKey)) as any;

  const patternData =
    raw.rawOutput?.patternDetect || raw.rawOutput?.patterns || {};
  console.log('patternDetect keys:', Object.keys(patternData));

  const results = patternData.results || [];
  console.log('results count:', results.length);
  if (results.length > 0) {
    console.log(
      'First result:',
      JSON.stringify(results[0], null, 2).slice(0, 600)
    );

    // Check which have file1/file2
    const withPairs = results.filter((r: any) => r.file1 && r.file2);
    const withFile = results.filter((r: any) => r.file && !r.file1);
    console.log('\nWith file1+file2:', withPairs.length);
    console.log('With only file (no pair):', withFile.length);

    if (withPairs.length > 0) {
      console.log(
        '\nSample pair:',
        JSON.stringify(withPairs[0], null, 2).slice(0, 400)
      );
    }
  }
}

test().catch(console.error);

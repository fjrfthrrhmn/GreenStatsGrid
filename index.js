import fs from 'fs';
import moment from 'moment';
import simpleGit from 'simple-git';

const git = simpleGit();
const date = moment().toISOString();

async function run() {
  let data = [];

  if (fs.existsSync('data.json')) {
    const raw = fs.readFileSync('data.json', 'utf-8');
    try {
      const parsed = JSON.parse(raw);
      data = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error('Failed to parse data.json:', e);
    }
  }

  data.push({ date });
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  // Commit dulu
  await git.add('data.json');
  await git.commit(`🌱 random commit ${date}`);

  // Baru pull dengan rebase
  await git.pull('origin', 'main', { '--rebase': 'true' });

  // Push hasil akhir
  await git.push();
}

run();

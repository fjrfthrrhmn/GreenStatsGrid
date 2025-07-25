import fs from 'fs';
import moment from 'moment';
import simpleGit from 'simple-git';

const git = simpleGit();
const date = moment().toISOString();
const id = Math.floor(Math.random() * 9999);

async function run() {
  fs.writeFileSync('data.json', JSON.stringify({ date, id }, null, 2));

  await git.add('data.json');
  await git.commit(`🌱 random commit ${id} - ${date}`);
  await git.push();
}

run();

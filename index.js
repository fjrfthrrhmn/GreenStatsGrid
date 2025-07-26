import fs from 'fs';
import moment from 'moment';
import simpleGit from 'simple-git';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const git = simpleGit();

class GitHubCommitAutomator {
  constructor(repoPath = './', logFile = 'daily-progress.md') {
    this.repoPath = repoPath;
    this.logFile = logFile;
    this.commitMessages = [
      'Update project documentation',
      'Improve code structure',
      'Add daily progress notes',
      'Update README and comments',
      'Refactor and optimize code',
      'Add new features and improvements',
      'Fix minor bugs and issues',
      'Update dependencies and configs',
    ];
  }

  // Generate random commit times for the day (3-4 commits)
  generateCommitTimes() {
    const times = [];
    const commitCount = Math.random() > 0.5 ? 3 : 4;

    // Define time slots to avoid clustering
    const timeSlots = [
      { start: 9, end: 11 }, // Morning
      { start: 13, end: 15 }, // Afternoon
      { start: 16, end: 18 }, // Late afternoon
      { start: 19, end: 21 }, // Evening
    ];

    // Randomly select time slots
    const selectedSlots = timeSlots.sort(() => 0.5 - Math.random()).slice(0, commitCount);

    selectedSlots.forEach(slot => {
      const hour = Math.floor(Math.random() * (slot.end - slot.start)) + slot.start;
      const minute = Math.floor(Math.random() * 60);
      times.push({ hour, minute });
    });

    return times.sort((a, b) => a.hour - b.hour || a.minute - b.minute);
  }

  // Create meaningful content for commit
  async createMeaningfulChange() {
    const today = moment().format('YYYY-MM-DD');
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    // Update or create progress log
    let content = '';
    if (fs.existsSync(this.logFile)) {
      content = fs.readFileSync(this.logFile, 'utf8');
    } else {
      content = '# Daily Progress Log\n\n';
    }

    const progressEntry = `## ${today}\n- ${timestamp}: Work in progress\n- Updated project files\n- Code improvements and optimizations\n\n`;

    // Add entry at the top (after header)
    const lines = content.split('\n');
    lines.splice(2, 0, progressEntry);

    fs.writeFileSync(this.logFile, lines.join('\n'));

    return `Update progress log - ${timestamp}`;
  }

  // Get random commit message
  getRandomCommitMessage() {
    const randomIndex = Math.floor(Math.random() * this.commitMessages.length);
    return this.commitMessages[randomIndex];
  }

  // Make a single commit
  async makeCommit() {
    try {
      // Create meaningful change
      const commitMsg = await this.createMeaningfulChange();

      // Add files to staging
      await git.add('.');

      // Check if there are changes to commit
      const status = await git.status();
      if (status.files.length === 0) {
        console.log('No changes to commit');
        return false;
      }

      // Commit with message
      await git.commit(commitMsg);
      console.log(`✅ Commit made: ${commitMsg}`);

      return true;
    } catch (error) {
      console.error('❌ Error making commit:', error.message);
      return false;
    }
  }

  // Push commits to remote
  async pushCommits() {
    try {
      await git.push('origin', 'main');
      console.log('✅ Commits pushed to remote repository');
    } catch (error) {
      console.error('❌ Error pushing commits:', error.message);
    }
  }

  // Run daily commit automation
  async runDailyCommits() {
    console.log(`🚀 Starting daily commit automation for ${moment().format('YYYY-MM-DD')}`);

    const commitTimes = this.generateCommitTimes();
    console.log(`📅 Planned commits: ${commitTimes.length}`);

    let successfulCommits = 0;

    for (const time of commitTimes) {
      const success = await this.makeCommit();
      if (success) {
        successfulCommits++;

        // Wait a bit between commits to look natural
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (successfulCommits > 0) {
      await this.pushCommits();
      console.log(`✅ Daily automation complete: ${successfulCommits} commits made`);
    } else {
      console.log('⚠️ No commits were made today');
    }

    return successfulCommits;
  }

  // Setup cron job for daily execution
  setupCronJob() {
    const cronCommand = `0 9 * * * cd ${process.cwd()} && node ${process.argv[1]}`;
    console.log('To setup daily automation, add this to your crontab:');
    console.log(cronCommand);
    console.log('\nRun: crontab -e');
    console.log('Then add the line above to run daily at 9 AM');
  }

  // Backfill commits for past dates (use carefully!)
  async backfillCommits(daysBack = 30) {
    console.log(`⚠️ BACKFILL MODE: Creating commits for last ${daysBack} days`);
    console.log('This should only be used for legitimate project work!');

    for (let i = daysBack; i >= 1; i--) {
      const date = moment().subtract(i, 'days');
      const commitCount = Math.random() > 0.3 ? (Math.random() > 0.5 ? 3 : 4) : 0;

      if (commitCount === 0) continue; // Skip some days naturally

      console.log(`\n📅 Processing ${date.format('YYYY-MM-DD')} (${commitCount} commits)`);

      for (let j = 0; j < commitCount; j++) {
        const hour = 9 + Math.floor(Math.random() * 12); // 9 AM to 9 PM
        const minute = Math.floor(Math.random() * 60);
        const commitDate = date.clone().hour(hour).minute(minute);

        // Create a simple change
        const logEntry = `${commitDate.format('YYYY-MM-DD HH:mm')}: Daily progress update\n`;
        fs.appendFileSync('backfill-log.txt', logEntry);

        // Commit with specific date
        const commitMessage = this.getRandomCommitMessage();
        const dateString = commitDate.format('YYYY-MM-DD HH:mm:ss');

        try {
          await git.add('.');
          await execAsync(`git commit -m "${commitMessage}" --date="${dateString}"`);
          console.log(`  ✅ ${commitDate.format('HH:mm')}: ${commitMessage}`);

          // Small delay
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.log(`  ❌ Failed: ${error.message}`);
        }
      }
    }

    console.log('\n🔄 Pushing all backfilled commits...');
    await this.pushCommits();
    console.log('✅ Backfill complete!');
  }
}

// Usage
const automator = new GitHubCommitAutomator();

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--backfill')) {
  const days = parseInt(args[args.indexOf('--backfill') + 1]) || 30;
  automator.backfillCommits(days);
} else if (args.includes('--setup-cron')) {
  automator.setupCronJob();
} else if (args.includes('--help')) {
  console.log(`
GitHub Commit Automator

Usage:
  node script.js                 # Run daily commits now
  node script.js --backfill 30   # Backfill last 30 days
  node script.js --setup-cron    # Show cron setup instructions
  node script.js --help          # Show this help

⚠️ Important Notes:
- Use responsibly and only for legitimate projects
- Don't abuse GitHub's contribution system
- Make sure you're working on real projects
- Consider the ethical implications
    `);
} else {
  // Run daily commits
  automator.runDailyCommits();
}

export default GitHubCommitAutomator;

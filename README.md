# 🚀 Setup Guide - GitHub Auto Commit

## Step 1: Create Repository

```bash
# Option A: Create new repo
gh repo create auto-commit-repo --public
cd auto-commit-repo

# Option B: Use existing repo
cd your-existing-repo
```

## Step 2: Add Workflow File

Buat structure folder:
```bash
mkdir -p .github/workflows
mkdir -p logs
```

Copy workflow file ke `.github/workflows/auto-commit.yml`

## Step 3: Initial Setup

```bash
# Add files
git add .
git commit -m "feat: setup auto commit workflow"
git push origin main
```

## Step 4: Enable GitHub Actions

1. Go to your repo Settings
2. Click **Actions** → **General**  
3. Set **Actions permissions** to "Allow all actions"
4. Save changes

## Step 5: Verify Setup

1. Go to **Actions** tab
2. Should see "Auto Commit Daily" workflow
3. Check **workflow runs** (akan kosong dulu)

<<<<<<< HEAD
## Step 6: Test Manual Run

1. Go to Actions → Auto Commit Daily
2. Click **Run workflow** 
3. Click **Run workflow** button
4. Wait dan check hasilnya

## 📊 Schedule Overview

| Time (UTC) | Time (WIB) | Days | Probability |
|------------|------------|------|-------------|
| 2:15 AM    | 9:15 AM    | Mon,Tue,Thu,Fri | 60% |
| 3:45 AM    | 10:45 AM   | Tue,Wed,Fri | 60% |
| 6:30 AM    | 1:30 PM    | Mon,Wed,Thu | 40% |
| 7:15 AM    | 2:15 PM    | Tue,Fri | 40% |
| 10:45 AM   | 5:45 PM    | Mon,Thu | 30% |
| 11:20 AM   | 6:20 PM    | Wed | 30% |

## 🛡️ Safety Tips

### Do's ✅
- Monitor commit patterns regularly
- Add real work to other repositories  
- Keep commit messages meaningful
- Use probability-based scheduling

### Don'ts ❌  
- Don't run on every single day
- Don't use identical commit times
- Don't commit only empty changes
- Don't abuse the system

## 🔧 Customization

### Change Probability:
Edit `THRESHOLD` values in workflow:
```yaml
THRESHOLD=60  # 60% chance
```

### Change Schedule:
Edit cron expressions (remember UTC = WIB - 7):
```yaml
- cron: '15 2 * * 1,2,4,5'  # 9:15 AM WIB
```

### Change Commit Messages:
Edit `UPDATES` array in workflow:
```bash
UPDATES=(
  "docs: your custom message"
  "feat: another message"
)
```

## 📱 Monitoring Commands

```bash
# Check recent commits
git log --oneline -10

# Check workflow status (requires gh CLI)
gh run list

# View specific run
gh run view [RUN_ID]
```

## ❗ Troubleshooting

**Issue**: Workflow not running
- Check if Actions enabled in Settings
- Verify cron syntax
- Check repository permissions

**Issue**: No commits made  
- Normal behavior (probability-based)
- Check workflow logs in Actions tab
- Verify file changes are being made

**Issue**: Authentication errors
- GitHub Actions uses automatic GITHUB_TOKEN
- No additional setup needed for public repos

## 🎯 Expected Results

- **3-8 commits per week** (random)
- **Natural patterns** (not every day)
- **Meaningful changes** (logs, docs updates)
- **Varied timing** (different hours)

Dengan setup ini, lu bakal punya repository yang commit otomatis dengan pattern natural dan aman! 🎉
=======
## Last Activity
- **Date**: 2025-08-21
- **Time**: 17:51:59 WIB
- **Status**: Active development

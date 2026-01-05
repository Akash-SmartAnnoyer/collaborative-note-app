# Setup Guide

## Node.js Version Management

This project requires **Node.js >= 18.17.0**. We're using **Node.js v24.12.0** (latest LTS).

### Using nvm (Recommended)

1. **Check if nvm is installed:**
   ```bash
   nvm --version
   ```

2. **Install and use the latest LTS:**
   ```bash
   nvm install --lts
   nvm use --lts
   nvm alias default node
   ```

3. **Or use the version specified in `.nvmrc`:**
   ```bash
   nvm use
   ```

4. **Verify the version:**
   ```bash
   node --version  # Should show v24.12.0 or higher
   ```

### Making nvm Available in All Terminals

Add this to your `~/.bashrc` or `~/.zshrc`:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Quick Start

```bash
# Navigate to project
cd collaborative-note-app

# Ensure correct Node.js version (if using nvm)
nvm use

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)


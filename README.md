# Velocity Rush
![Velocity Rush](https://cdn.zekeosborn.xyz/velocity-rush-featured.png)  
An auto-runner game built to break Monad!

## Requirements

Before you begin, you need to install the following tools:

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download)
- [Godot](https://godotengine.org/download)

## Installation

### 1. Install dependencies

```
cd velocity-rush
npm install
```

### 2. Configure Environment Variables

#### Nextjs Workspace

- **SITE_MAINTENANCE**: Set to true to enable maintenance
- **SITE_PAUSED**: Set to true to temporarily pause the site
- **NEXTAUTH_URL**: URL for NextAuth authentication
- **NEXTAUTH_SECRET**: Secret key for NextAuth (generate with `openssl rand -base64 32`)
- **HMAC_SECRET_KEY**: HMAC secret key to secure the API (generate with `openssl rand -hex 32`)
- **DATABASE_URL**: PostgreSQL database connection URL
- **PRIVATE_KEY**: Private key for blockchain interactions (grab the first private key from `npm run hardhat:chain`)
- **TOKEN_ADDRESS**: Deployed RUSH token contract address (grab from `npm run hardhat:deploy`)
- **NEXT_PUBLIC_PROJECT_ID**: WalletConnect Project ID (grab from [WalletConnect](https://cloud.walletconnect.com))
- **NEXT_PUBLIC_MONAD_RPC_URL**: Monad RPC URL (*leave it empty during development to use hardhat network*)
- **NEXT_PUBLIC_API_BASE_URL**: API base URL to be use by the godot game

#### Hardhat Workspace

Required if you plan to deploy the contract to Monad live network.

- **PRIVATE_KEY**: Private key used for deployment
- **MONAD_RPC_URL**: Monad RPC URL (default to https://testnet-rpc.monad.xyz)

### 3. Configure Godot

#### Re-export the game with your own HMAC secret key

1. Open `project.godot` in Godot Engine
2. Navigate to `scripts/globals/global.gd`
3. Set `HMAC_SECRET_KEY` constant to HMAC secret key from env
4. Go to *Project* -> *Export*, select *Web* preset
5. Under *Encryption* tab, Set *Encryption Key* field to HMAC secret key from env
6. Export the game to `../nextjs/public/velocity-rush/index.html`
7. Set `HMAC_SECRET_KEY` constant back to empty string

#### Restore the splash screen background

1. Open the project in code editor
2. Navigate to `packages/nextjs/public/velocity-rush/index.html`
3. Locate the `#status` CSS rule and replace it with:

```css
#status {
	background-image: url('../images/background.png');
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	background-color: #b5b6ee;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	visibility: hidden;
}
```

### 4. Running the Game

Open three terminal windows and execute the following commands:

#### Terminal 1: Start Hardhat Network

```
npm run hardhat:chain
```

Copy the first private key and paste to PRIVATE_KEY variable in nextjs workspace's env

#### Terminal 2: Deploy Smart Contracts

````
npm run hardhat:deploy
````

Copy the contract address and paste to TOKEN_ADDRESS variable in nextjs workspace's env

#### Terminal 3: Start Nextjs Development Server

```
npm run next:dev
```

Now you can visit the game on http://localhost:3000

## Optional

### 1. Linting on Save with Visual Studio Code and ESLint

1. Install ESLint extension by Microsoft
2. Add the following configuration to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  }
}
```

### 2. Commit with Commitizen

We use Angular Conventional Commits in this project. You can access the helper by running `npm run commit` or `npx cz`.

For more convenience, you can install Commitizen globally with `npm install -g commitizen`, then run `git cz` to access the helper.

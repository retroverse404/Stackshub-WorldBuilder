## Tasks outside this session (accounts, keys, registrations)

### Required accounts / registrations
- Create a Privy app in the Privy Console.
- (If using quorum keys) Contact Privy to enable key quorum for the app.

### Required keys / secrets (to put in `.env.local`)
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy App ID from the Privy Console.
- `PRIVY_APP_SECRET`: Privy App Secret from the Privy Console.
- `QUORUMS_PUBLIC_KEY`: Public key for your quorum signer.
- `QUORUMS_PRIVATE_KEY`: Private key for your quorum signer.
- `QUORUMS_KEY`: The quorum key identifier (from Privy).

### Privy dashboard setup
- Enable the login methods and wallet settings your app uses (email, passkey/social, embedded wallet behavior).
- Add allowed origins (e.g. `http://localhost:3000` and your prod domain).
- Keep in mind: Privy external connector chains are documented for EVM/Solana; this demo's Stacks flow is server-side signing with Privy-managed keys.

### Stacks network prerequisites
- Testnet: fund a testnet address using the Stacks testnet faucet.
- Mainnet: fund a mainnet address with real STX if you plan to use `/api/buy-meme` or `/api/sell-meme`.

### Code-level updates you should plan
- Replace the hardcoded wallet address in:
  - `src/app/api/buy-meme/route.ts`
  - `src/app/api/sell-meme/route.ts`
- Confirm any contract addresses/amounts used for trading are correct for your target network.
- Standardize auth-token verification behavior across all API routes.
- Add signer abstraction before integrating external Stacks wallets (Leather/Xverse).

### Optional but recommended
- Configure session signers in your app if you want delegated signing.
- Verify your STX.city contract targets and parameters for mainnet usage.
- Document your architecture using `docs/STACKS_ARCHITECTURE.md` for audits/grants.

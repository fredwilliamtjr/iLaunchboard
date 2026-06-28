# iLaunchboard

A visual macOS app for managing `launchd` agents and daemons. Built with Tauri v2.

iLaunchboard helps you browse user LaunchAgents (`~/Library/LaunchAgents/`), system agents, and system daemons. You can start, stop, restart, inspect, edit, and create user agents from a desktop UI.

![iLaunchboard screenshot](assets/print.png)

## Features

- List User Agents, System Agents, and System Daemons
- Search and filter by label, source, status, and PID
- Sort table columns
- Start / Stop / Restart / Test Run for User Agents
- Create new agents, edit and delete existing user agents
- Schedule configuration with interval/calendar previews
- View stdout/stderr logs
- Inspect plist configuration details
- Reveal plist files in Finder
- Light, dark, and system theme modes
- English and Portuguese UI

System Agents and Daemons are read-only. Modification operations are limited to User Agents.

## Development

```bash
pnpm install
pnpm tauri:dev
```

Frontend only:

```bash
pnpm dev
```

Production build:

```bash
pnpm tauri:build
```

## Testing / Lint

```bash
pnpm test
pnpm lint
pnpm typecheck

cargo test --manifest-path src-tauri/Cargo.toml
cargo fmt --manifest-path src-tauri/Cargo.toml --check
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
```

## Origin

This project is based on [azu/launchd-ui](https://github.com/azu/launchd-ui), originally published under the MIT License.

## License

MIT

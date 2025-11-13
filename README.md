# fetch-dev-tools

A lightweight toolkit to mock and simulate all kinds of fetch / API calls during development and testing. Plug it into any app with a single line of change and use powerful controls to simulate failures, throttles, latency, intermittent errors, rate limits, and other network behaviors that are hard to reproduce otherwise.

## Why this exists

Real-world networks fail in many ways: timeouts, partial responses, throttling, transient HTTP errors, slow connections, and service flakiness. These conditions are difficult to reproduce reliably in local development and CI. fetch-dev-tools makes it easy to inject deterministic or random network behavior so you can build resilient clients and create reliable tests.

Key ideas:
- Single-line integration for most environments.
- Declarative rules to simulate errors, latency, throttles, and response sequences.
- Works in Node.js, browser (Service Worker or fetch override), and test runners (Jest, Mocha).
- Useful for development, automated tests, and CI.

## Features

- Single-line enablement in Node/browser/test setup
- Rule-based mocking by URL, method, headers, query params, or regex
- Simulate:
  - Timeouts and network errors
  - HTTP status codes (4xx/5xx)
  - Latency and bandwidth throttling
  - Connection drops and partial responses
  - Rate limiting and concurrency limits
  - Response sequencing (different responses for successive calls)
- Fixture / static response support (JSON, text, binary)
- Recording & replay mode for capturing real responses and replaying them
- Deterministic and randomized modes
- Integrations: fetch, node-fetch, axios, XHR (via Service Worker or overrides)
- CLI for local mock server and for driving scenarios in CI

## Quick start

Node (single-line):
```
# require at top of your app or test bootstrap
require('fetch-dev-tools/register');
```

ESM:
```
import 'fetch-dev-tools/register';
```

This single line installs a fetch/HTTP interceptor with default behavior. Configure it with environment variables or a config file (see Configuration).

Test setup (Jest example):
```
/* jest.setup.js */
import 'fetch-dev-tools/register';
import { mock } from 'fetch-dev-tools';

beforeEach(() => mock.reset());
afterAll(() => mock.restore());
```

CLI (start a local mock server):
```
npx fetch-dev-tools serve --config config/mocks.json --port 3001
```

## Configuration

A simple rule structure (JSON or JS):

{
  "rules": [
    {
      "match": {
        "url": "https://api.example.com/users/.*",
        "method": "GET"
      },
      "actions": [
        { "type": "delay", "ms": 1200 },
        { "type": "throttle", "kbps": 50 },
        { "type": "respond", "status": 200, "bodyFile": "fixtures/user.json" }
      ]
    },
    {
      "match": { "url": "https://api.example.com/payments", "method": "POST" },
      "actions": [
        { "type": "fault", "mode": "timeout", "afterMs": 3000 }
      ],
      "percentage": 30
    }
  ],
  "defaults": { "mode": "deterministic" }
}

Common action types:
- respond: return a response (status, headers, body or fixture file)
- delay: add latency in ms
- throttle: simulate bandwidth limit (kbps)
- fault: network fault (timeout, connection-reset)
- sequence: return different responses on successive calls
- proxy: forward to real endpoint (optionally record)

You can override with env vars:
- FDT_CONFIG=path/to/config.json
- FDT_MODE=random
- FDT_PORT=3001

## Programmatic API (examples)

Start / stop:
```
import { startMock, stopMock, mock } from 'fetch-dev-tools';

startMock({ config: './config/mocks.json' });
// ... run app, tests, etc.
stopMock();
```

Create inline rule:
```
import { mock } from 'fetch-dev-tools';

mock.addRule({
  match: { url: '/api/slow', method: 'GET' },
  actions: [
    { type: 'delay', ms: 2000 },
    { type: 'respond', status: 200, body: { ok: true } }
  ]
});
```

Sequence example:
```
mock.addRule({
  match: { url: '/api/flaky' },
  actions: [
    { type: 'sequence', responses: [
        { status: 500, body: { error: 'oops' } },
        { status: 200, body: { ok: true } }
      ]
    }
  ]
});
```

Restore native behavior:
```
mock.restore(); // removes interceptors and returns to normal fetch/axios behavior
```

## Test examples

Jest:
```
import 'fetch-dev-tools/register';
import { mock } from 'fetch-dev-tools';

beforeEach(() => {
  mock.reset();
  mock.addRule({
    match: { url: '/api/items' },
    actions: [{ type: 'respond', status: 200, body: [{ id: 1 }] }]
  });
});

test('fetch items', async () => {
  const res = await fetch('/api/items');
  const json = await res.json();
  expect(json).toEqual([{ id: 1 }]);
});
```

Cypress / Playwright:
- Use the serve CLI to run a mock server during e2e tests, or inject the Service Worker version in the browser context.

## Integrations and adapters

- Node fetch / global fetch
- axios adapter (intercepts axios requests)
- Service Worker for browsers (recommended for e2e and dev)
- Express middleware for server-side mock endpoints
- Test runner setupFiles / fixtures directory

## Advanced capabilities

- Record & replay: capture real API responses to fixtures and use them later
- Randomized failure injection with seed control for reproducible flaky tests
- Conditional rules by header, query param, body contents
- Rate-limiting simulation with token-bucket or leaky-bucket config
- Partial responses and content-range simulation for streaming tests

## CLI reference

serve
- --config <file> : path to config file
- --port <n> : port to run mock server
- --record : proxy and record responses to fixtures

inspect
- list active rules and match counts

reset
- clear rules and recordings

See `npx fetch-dev-tools --help` for full CLI usage.

## Examples & recipes

- Simulating intermittent 500s for a retry policy test
- Throttling downloads to test progress UI
- Forcing authentication failures to test login flows
- Replaying production responses locally for offline development

## Contributing

Contributions welcome. Please:
1. Open an issue to discuss larger changes
2. Fork and create a feature branch
3. Add tests under `tests/`
4. Open a PR with a clear description and use cases

## Development

Languages: Node.js + optional small helper scripts. The library installs cleanly with npm/yarn and exposes both programmatic and CLI interfaces.

## License

MIT — see LICENSE file for details

## Contact

Open an issue in this repository for questions, feature requests, or to report bugs.

# Netlify Functions v2 + Monorepo Dependencies Bug Reproduction

This repository demonstrates a bug where **Netlify Functions v2 (modern API) fails to resolve workspace dependencies** in monorepo setups, while the legacy v1 API works correctly with the same dependencies.

## 🐛 The Bug

Netlify Functions v2 cannot import workspace packages in monorepo setups, causing runtime failures. The legacy v1 lambda-compatible API handles workspace dependencies correctly.

## 🚀 Quick Reproduction

```bash
# Install dependencies
pnpm install

# Run automated test suite (starts server + runs tests)
pnpm test
```

Expected result: 3 tests pass, 1 test fails with 💥 emoji indicating the bug.

## 📊 Test Results

| Scenario | API Version | Dependencies | Status |
|----------|-------------|--------------|--------|
| `hello` | Modern v2 | None | ✅ **PASS** |
| `hello-lambda` | Legacy v1 | None | ✅ **PASS** |
| `hello-lambda-deps` | Legacy v1 | Workspace | ✅ **PASS** |
| `hello-deps` | Modern v2 | Workspace | ❌ **FAIL** 💥 |

>[!WARNING]
> the fourth test passes but note the test assertion is on the failure.
> In other words, it "successfully fails".
>
> We thought it would be easier to highlight the buggy behavior that way.

## 📁 Project Structure

```
netlify_monorepo_example/
├── packages/
│   ├── flip-text/                    # Shared utility package
│   │   ├── index.ts                  # Re-exports flipText function
│   │   ├── flip-text.ts              # Reverses word order in strings
│   │   └── package.json              # @test/flip-text
│   └── my-netlify-functions/         # Netlify functions package
│       ├── src/
│       │   ├── hello.ts              # ✅ v2 API, no deps
│       │   ├── hello-lambda.ts       # ✅ v1 API, no deps
│       │   ├── hello-lambda-deps.ts  # ✅ v1 API, with deps
│       │   └── hello-deps.ts         # ❌ v2 API, with deps (FAILS)
│       ├── netlify.toml              # Functions directory config
│       └── package.json              # @test/my-netlify-functions
├── index.test.ts                     # Integration test suite
└── package.json                      # Monorepo root with pnpm workspaces
```

## 🔍 Function Comparison

### Working: Legacy v1 API with Dependencies
```typescript
// hello-lambda-deps.ts - WORKS ✅
import { HandlerEvent, Context } from '@netlify/functions';
import flipText from '@test/flip-text'; // Workspace import works

export const handler = async (event: HandlerEvent, context: Context) => {
  return { statusCode: 200, body: flipText("Hello lambda") };
}
```

### Failing: Modern v2 API with Dependencies
```typescript
// hello-deps.ts - FAILS ❌
import { Context } from '@netlify/functions';
import flipText from '@test/flip-text'; // Workspace import fails

export default (request: Request, context: Context) => {
  return new Response(flipText("Hello world"), { status: 200 });
}
```

## 🔧 Technical Details

### Dependency Resolution
- **Workspace Package**: `@test/flip-text` referenced as `workspace:*` in `package.json`
- **Import Statement**: `import flipText from '@test/flip-text'`
- **Expected**: Both APIs should resolve workspace dependencies identically
- **Actual**: Only v1 API resolves workspace dependencies successfully

## 🎯 Expected vs Actual Behavior

### Expected ✅
All functions should successfully import and use workspace dependencies, regardless of API version.

### Actual ❌
- Modern v2 API functions fail when importing workspace packages
- Legacy v1 API functions work correctly with identical workspace imports
- Error suggests module resolution or bundling differences between API versions

## 📋 Environment

- **Node.js**: v18+ (uses native test runner)
- **Package Manager**: pnpm with workspaces
- **Netlify CLI**: v23.5.1
- **Functions API**: @netlify/functions v4.2.5

## ✋ Manual Testing

If you prefer to run tests manually:

```bash
# Start Netlify dev server
pnpm start

# In another terminal, test endpoints:
curl http://localhost:9999/.netlify/functions/hello              # ✅ Works
curl http://localhost:9999/.netlify/functions/hello-lambda       # ✅ Works
curl http://localhost:9999/.netlify/functions/hello-lambda-deps  # ✅ Works
curl http://localhost:9999/.netlify/functions/hello-deps         # ❌ Fails
```

## 📝 Notes

This reproduction case uses a minimal setup to isolate the workspace dependency resolution issue. The `flip-text` package provides a simple utility that reverses word order, demonstrating that the issue affects any workspace dependency, not just complex packages.
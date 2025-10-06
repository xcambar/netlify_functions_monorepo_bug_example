import test from 'node:test';
import assert from 'assert/strict';
import myFunction from './packages/my-netlify-functions/src/hello-deps';

test("[MODERN, WITH_DEPS] The dependencies are well resolved when not run as netlify Functions", async function() {
  const response: Response = myFunction(null as any, null as any);
  assert.equal(await response.text(), "world Hello");
})
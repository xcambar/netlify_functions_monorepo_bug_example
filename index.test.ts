import test from 'node:test';
import assert from 'assert/strict';

test("[MODERN, NO_DEPS] it's serving a simple netlify function", async function() {
  const request = new Request("http://localhost:9999/.netlify/functions/hello");
  const result = await fetch(request)
  assert.equal(result.ok, true);
})

test("[LAMBDA-COMPAT, NO_DEPS] it's serving a simple netlify function in lambda-compat mode", async function() {
  const request = new Request("http://localhost:9999/.netlify/functions/hello-lambda");
  const result = await fetch(request)
  assert.equal(result.ok, true);
})

test("[LAMBDA-COMPAT, WITH_DEPS] it's serving a netlify function with monorepo dependencies in lambda-compat mode", async function() {
  const request = new Request("http://localhost:9999/.netlify/functions/hello-lambda-deps");
  const result = await fetch(request)
  assert.equal(result.ok, true);
})

test("💥 [MODERN, WITH_DEPS] it's FAILING to serve a netlify function with monorepo dependencies", async function() {
  const request = new Request("http://localhost:9999/.netlify/functions/hello-deps");
  const result = await fetch(request)
  assert.notEqual(result.ok, true);
})
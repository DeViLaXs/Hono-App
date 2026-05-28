"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudflare_test_1 = require("cloudflare:test");
const vitest_1 = require("vitest");
const index_1 = __importDefault(require("../src/index"));
// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = (Request);
(0, vitest_1.describe)("Hello World worker", () => {
    (0, vitest_1.it)("responds with Hello World! (unit style)", async () => {
        const request = new IncomingRequest("http://example.com");
        // Create an empty context to pass to `worker.fetch()`.
        const ctx = (0, cloudflare_test_1.createExecutionContext)();
        const response = await index_1.default.fetch(request, cloudflare_test_1.env, ctx);
        // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
        await (0, cloudflare_test_1.waitOnExecutionContext)(ctx);
        (0, vitest_1.expect)(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
    });
    (0, vitest_1.it)("responds with Hello World! (integration style)", async () => {
        const response = await cloudflare_test_1.SELF.fetch("https://example.com");
        (0, vitest_1.expect)(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
    });
});

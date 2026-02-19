// @vitest-environment nuxt
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
import { createError } from "h3";
import AlertHistory from "../AlertHistory.vue";

describe("AlertHistory Error Handling", () => {
  it("displays the error message when the backend returns a 500 status", async () => {
    // We register the endpoint here. Since it's a new file,
    // there is no conflict with the "Success" mock.
    registerEndpoint("http://localhost:8081/api/v1/sensors/alerts", {
      handler: () => {
        throw createError({
          statusCode: 500,
          statusMessage: "Internal Server Error",
        });
      },
    });

    const wrapper = await mountSuspended(AlertHistory);

    // Wait for the 'pending' state to switch to 'error'
    let count = 0;
    while (wrapper.text().includes("Loading...") && count < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      count++;
    }

    // This targets your <div v-else-if="error">Error: {{ error.message }}</div>
    expect(wrapper.text()).toContain("Error:");
    expect(wrapper.text()).toContain("Internal Server Error");
  });
});

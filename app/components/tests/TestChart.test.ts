// @vitest-environment nuxt
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
import TestChart from "../TestChart.vue";

describe("TestChart.vue - Success Path", () => {
  // Helper to wait for the Nuxt loading state to resolve
  const waitForLoading = async (wrapper: any) => {
    let count = 0;
    while (wrapper.text().includes("Loading...") && count < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      count++;
    }
  };

  it("fetches and transforms station names for the chart", async () => {
    // 1. ARRANGE: Register the virtual server endpoint with mock data
    registerEndpoint(
      "http://localhost:8081/api/v1/sensors/alerts/count-by-station",
      {
        handler: () => [
          {
            stationName: "Cheras,Kuala Lumpur, Wilayah Persekutuan",
            total: 186,
          },
          {
            stationName: "Batu Muda,Kuala Lumpur, Wilayah Persekutuan",
            total: 95,
          },
        ],
      },
    );

    // 2. ACT: Mount the component
    const wrapper = await mountSuspended(TestChart);
    await waitForLoading(wrapper);

    // 3. ASSERT: Detailed checks

    expect(wrapper.text()).toContain("Cheras");
    expect(wrapper.text()).toContain("Batu Muda");
    expect(wrapper.text()).not.toContain("Kuala Lumpur");
    expect(wrapper.text()).not.toContain("Wilayah Persekutuan");

    // Check that the totals are displayed correctly
    expect(wrapper.text()).toContain("186");
    expect(wrapper.text()).toContain("95");
  });
});

// @vitest-environment nuxt
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { describe, it, expect } from "vitest";
import AlertHistory from "../AlertHistory.vue";

describe("AlertHistory.vue - Success Path", () => {
  // Helper to wait for the Nuxt loading state to resolve
  const waitForLoading = async (wrapper: any) => {
    let count = 0;
    while (wrapper.text().includes("Loading...") && count < 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      count++;
    }
  };

  it("renders multiple alerts from the sensor API correctly", async () => {
    // 1. ARRANGE: Register the virtual server endpoint with mock data
    registerEndpoint("http://localhost:8081/api/v1/sensors/alerts", {
      handler: () => [
        {
          id: 1,
          zoneName: "Kuala Lumpur Central",
          stationName: "Station 01",
          aqiValue: 42,
          timestamp: "2026-02-12T10:00:00Z",
        },
        {
          id: 2,
          zoneName: "Petaling Jaya",
          stationName: "Station 05",
          aqiValue: 155,
          timestamp: "2026-02-12T10:15:00Z",
        },
      ],
    });

    // 2. ACT: Mount the component
    const wrapper = await mountSuspended(AlertHistory);
    await waitForLoading(wrapper);

    // 3. ASSERT: Detailed checks

    const alerts = wrapper.findAll(".py-3");
    expect(alerts).toHaveLength(2);

    expect(wrapper.text()).toContain("Kuala Lumpur Central");
    expect(wrapper.text()).toContain("Station 01");
    expect(wrapper.text()).toContain("42 AQI");

    expect(wrapper.text()).toContain("Petaling Jaya");
    expect(wrapper.text()).toContain("155 AQI");
  });

  it("displays the formatted time correctly", async () => {
    const testDate = "2026-02-12T14:30:00Z";

    registerEndpoint("http://localhost:8081/api/v1/sensors/alerts", {
      handler: () => [
        {
          id: 3,
          zoneName: "Test Zone",
          stationName: "Test Station",
          aqiValue: 50,
          timestamp: testDate,
        },
      ],
    });

    const wrapper = await mountSuspended(AlertHistory);
    await waitForLoading(wrapper);

    // Your formatTime function uses local time, so we check for the pattern "HH:MM"
    // This ensures your utility function in the <script setup> is working
    expect(wrapper.text()).toMatch(/\d{2}:\d{2}/);
  });
});

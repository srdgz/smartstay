import { describe, expect, it } from "vitest";

import { stayStatus } from "./stay";

describe("stayStatus", () => {
  it("is upcoming before the check-in day", () => {
    expect(stayStatus("2030-05-10", "2030-05-15", "2030-05-09")).toBe("upcoming");
  });

  it("is in progress from the check-in day until the night before check-out", () => {
    expect(stayStatus("2030-05-10", "2030-05-15", "2030-05-10")).toBe("inProgress");
    expect(stayStatus("2030-05-10", "2030-05-15", "2030-05-14")).toBe("inProgress");
  });

  it("is completed from the check-out day", () => {
    expect(stayStatus("2030-05-10", "2030-05-15", "2030-05-15")).toBe("completed");
    expect(stayStatus("2030-05-10", "2030-05-15", "2031-01-01")).toBe("completed");
  });
});

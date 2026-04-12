import fc from "fast-check";
import {
  createMeetingSchema,
  listQuerySchema,
  meetingSchema,
} from "../meeting";

// Valid meeting arbitrary (manual)
const safeDate = (min: Date, max: Date) =>
  fc.integer({ min: min.getTime(), max: max.getTime() }).map(ms => new Date(ms).toISOString());

const validCreateInput = fc.record({
  title: fc.string({ minLength: 1, maxLength: 200 }),
  startTime: safeDate(new Date('2020-01-01'), new Date('2029-12-31')),
  endTime: safeDate(new Date('2020-01-02'), new Date('2030-01-01')),
}).filter(m => new Date(m.startTime) < new Date(m.endTime));

describe("meetingSchema", () => {
  it("parses a valid meeting object", () => {
    const result = meetingSchema.safeParse({
      id: "abc123",
      title: "Team Standup",
      startTime: "2025-01-01T10:00:00Z",
      endTime: "2025-01-01T11:00:00Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startTime).toBeInstanceOf(Date);
      expect(result.data.endTime).toBeInstanceOf(Date);
    }
  });
});

describe("createMeetingSchema", () => {
  it("accepts any input generated from its own shape", () => {
    fc.assert(
      fc.property(validCreateInput, (input) => {
        const result = createMeetingSchema.safeParse(input);
        expect(result.success).toBe(true);
      }),
      { numRuns: 200 }
    );
  });

  // Fuzz: random garbage always rejected
  test("random garbage is rejected by createMeetingSchema", () => {
    fc.assert(fc.property(fc.anything(), (input) => {
      return createMeetingSchema.safeParse(input).success === false;
    }), { numRuns: 200 });
  });

  it("rejects unknown keys", () => {
    const result = createMeetingSchema.safeParse({
      title: "Test Meeting",
      startTime: "2025-01-01T10:00:00Z",
      endTime: "2025-01-01T11:00:00Z",
      $where: "malicious",
    });
    expect(result.success).toBe(false);
  });

  it("rejects endTime <= startTime", () => {
    const now = new Date();
    const earlier = new Date(now.getTime() - 3600_000);
    const result = createMeetingSchema.safeParse({
      title: "Test Meeting",
      startTime: now.toISOString(),
      endTime: earlier.toISOString(),
    });
    expect(result.success).toBe(false);
  });
});

describe("listQuerySchema", () => {
  it("page is always >= 1 after parse", () => {
    fc.assert(
      fc.property(fc.integer({ min: -1000, max: 1000 }), (page) => {
        const result = listQuerySchema.safeParse({ page });
        if (result.success) {
          expect(result.data.page).toBeGreaterThanOrEqual(1);
        }
      }),
      { numRuns: 200 }
    );
  });

  it("limit is always <= 100 after parse", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100000 }), (limit) => {
        const result = listQuerySchema.safeParse({ limit });
        if (result.success) {
          expect(result.data.limit).toBeLessThanOrEqual(100);
        }
      }),
      { numRuns: 200 }
    );
  });
});

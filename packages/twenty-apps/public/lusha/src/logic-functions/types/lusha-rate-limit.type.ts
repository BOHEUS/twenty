// Lusha reports what the plan has left in each of its request windows on every
// response.
export type LushaRateLimit = {
  minuteRequestsLeft: number | undefined;
  hourlyRequestsLeft: number | undefined;
  dailyRequestsLeft: number | undefined;
};

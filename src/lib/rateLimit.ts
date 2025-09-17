// Temporary stub until we implement rate limiting
export const rateLimit = {
  async consume(userId: string) {
    // no-op (pretend always allowed)
    return true;
  },
};

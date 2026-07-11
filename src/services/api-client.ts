/**
 * Mock network client. Simulates latency and (optionally) failures so the
 * views can exercise real loading / error / success states.
 *
 * This is the ONLY place that "talks to the network". Feature services build
 * on top of it; ViewModels call the services; Views call the ViewModels.
 */

export type NetworkOptions = {
  /** Override the simulated latency (ms). */
  delayMs?: number;
  /** Force this request to reject, to exercise error states/tests. */
  shouldFail?: boolean;
};

const MIN_DELAY = 400;
const MAX_DELAY = 900;

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function randomDelay() {
  return MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
}

/**
 * Resolve `data` after a simulated network delay, or reject with an ApiError
 * when `shouldFail` is set.
 */
export function mockRequest<T>(data: T, options: NetworkOptions = {}): Promise<T> {
  const delay = options.delayMs ?? randomDelay();

  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (options.shouldFail) {
        reject(new ApiError('Network request failed. Please try again.'));
        return;
      }
      resolve(data);
    }, delay);
  });
}

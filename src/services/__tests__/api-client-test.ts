import { ApiError, mockRequest } from '@/services/api-client';

describe('mockRequest', () => {
  it('resolves with the provided data', async () => {
    await expect(mockRequest({ ok: true }, { delayMs: 0 })).resolves.toEqual({ ok: true });
  });

  it('rejects with an ApiError when shouldFail is set', async () => {
    await expect(mockRequest('x', { shouldFail: true, delayMs: 0 })).rejects.toBeInstanceOf(ApiError);
  });
});

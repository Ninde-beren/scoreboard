import { describe, expect, it, vi } from 'vitest';

import { displayError, safeJsonParse } from './utils';

describe('safeJsonParse', () => {
  it('returns the fallback when the stored value is absent', () => {
    expect(safeJsonParse(null, ['team', false, false, false])).toEqual([
      'team',
      false,
      false,
      false,
    ]);
  });

  it('parses a well-formed payload', () => {
    expect(safeJsonParse('{"id":3,"name":"Pool A"}', null)).toEqual({ id: 3, name: 'Pool A' });
  });

  it('falls back instead of throwing on malformed JSON', () => {
    expect(safeJsonParse('{oops', { id: 0 })).toEqual({ id: 0 });
  });

  it('falls back on a truncated payload, as a half-written localStorage entry would be', () => {
    expect(safeJsonParse('[{"id":1},{"id"', [])).toEqual([]);
  });

  // Documents a real trap: a literal "null" parses successfully, so the fallback
  // is bypassed and callers receive null rather than their default.
  it('returns null for the literal string "null" rather than the fallback', () => {
    expect(safeJsonParse('null', { id: 0 })).toBeNull();
  });
});

describe('displayError', () => {
  const setup = () => {
    const setOpenError = vi.fn();
    const setErrorText = vi.fn();
    const setError = vi.fn();
    const scheduleTimeout = vi.fn();
    return { setOpenError, setErrorText, setError, scheduleTimeout };
  };

  it('opens the snackbar with the given message', () => {
    const { setOpenError, setErrorText, setError, scheduleTimeout } = setup();

    displayError(setOpenError, setErrorText, setError, "Il n'y a pas d'équipe", scheduleTimeout);

    expect(setOpenError).toHaveBeenCalledWith(true);
    expect(setErrorText).toHaveBeenCalledWith("Il n'y a pas d'équipe");
    expect(setError).toHaveBeenCalledWith(true);
  });

  it('schedules the reset 2 seconds later instead of resetting immediately', () => {
    const { setOpenError, setErrorText, setError, scheduleTimeout } = setup();

    displayError(setOpenError, setErrorText, setError, 'boom', scheduleTimeout);

    expect(scheduleTimeout).toHaveBeenCalledTimes(1);
    expect(scheduleTimeout.mock.calls[0][1]).toBe(2000);
    expect(setOpenError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledTimes(1);
  });

  it('closes the snackbar and clears the error flag once the delay elapses', () => {
    const { setOpenError, setErrorText, setError, scheduleTimeout } = setup();

    displayError(setOpenError, setErrorText, setError, 'boom', scheduleTimeout);
    scheduleTimeout.mock.calls[0][0]();

    expect(setOpenError).toHaveBeenLastCalledWith(false);
    expect(setError).toHaveBeenLastCalledWith(false);
    // the message itself is left in place so the snackbar can fade out with its text
    expect(setErrorText).toHaveBeenCalledTimes(1);
  });
});

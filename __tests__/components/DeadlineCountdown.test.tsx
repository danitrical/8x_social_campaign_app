import React from 'react';
import { render } from '@testing-library/react-native';
import { DeadlineCountdown, getDeadlineInfo } from '../../src/components/DeadlineCountdown';

describe('getDeadlineInfo', () => {
  it('returns "Expired" for past deadlines', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const result = getDeadlineInfo(past);
    expect(result.label).toBe('Expired');
    expect(result.isUrgent).toBe(true);
  });

  it('returns "Due today" for deadline less than 24 hours away', () => {
    const today = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    const result = getDeadlineInfo(today);
    expect(result.label).toBe('Due today');
    expect(result.isUrgent).toBe(true);
  });

  it('returns "1 day left" for deadline 1–2 days away', () => {
    const tomorrow = new Date(Date.now() + 1.2 * 86400000).toISOString();
    const result = getDeadlineInfo(tomorrow);
    expect(result.label).toBe('1 day left');
    expect(result.isUrgent).toBe(true);
  });

  it('returns warning state for 2-3 days', () => {
    const twoDays = new Date(Date.now() + 2.5 * 86400000).toISOString();
    const result = getDeadlineInfo(twoDays);
    expect(result.isWarning).toBe(true);
    expect(result.isUrgent).toBe(false);
  });

  it('returns normal state for more than 3 days', () => {
    const tenDays = new Date(Date.now() + 10 * 86400000).toISOString();
    const result = getDeadlineInfo(tenDays);
    expect(result.isUrgent).toBe(false);
    expect(result.isWarning).toBe(false);
    expect(result.label).toBe('10 days left');
  });
});

describe('DeadlineCountdown component', () => {
  it('renders countdown text', () => {
    const tenDays = new Date(Date.now() + 10 * 86400000).toISOString();
    const { getByTestId } = render(<DeadlineCountdown deadline={tenDays} />);
    expect(getByTestId('deadline-countdown')).toBeTruthy();
  });

  it('shows urgent text for past deadline', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const { getByText } = render(<DeadlineCountdown deadline={past} />);
    expect(getByText('Expired')).toBeTruthy();
  });
});

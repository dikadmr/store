export interface EstimatedTimeline {
  targetStart: string;
  targetFinish: string;
}

export function calculateEstimatedTimeline(
  confirmedAt: Date,
  durationMinDays: number,
  durationMaxDays: number,
): EstimatedTimeline {
  const start = new Date(confirmedAt);
  const finish = new Date(confirmedAt);
  finish.setDate(finish.getDate() + durationMaxDays);

  return {
    targetStart: start.toISOString().split("T")[0],
    targetFinish: finish.toISOString().split("T")[0],
  };
}

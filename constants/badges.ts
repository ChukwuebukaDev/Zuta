export const BADGE_COLORS = {
 USER: {
    stroke: 'text-blue-500',
    fill: 'fill-blue-500/10',
  },
DEALER: {
    stroke: 'text-emerald-500',
    fill: 'fill-emerald-500/10',
  },
PREMIUM_DEALER: {
    stroke: 'text-amber-500',
    fill: 'fill-amber-500/10',
  },
  ADMIN: {
    stroke: 'text-purple-500',
    fill: 'fill-purple-500/10',
  },
  SUPERADMIN: {
    stroke: 'text-rose-600',
    fill: 'fill-rose-600/15',
  },
} as const;

export type CandidateRole = keyof typeof BADGE_COLORS;

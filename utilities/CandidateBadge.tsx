import { BadgeCheck, ShieldAlert, ShieldCheck } from 'lucide-react';
import { BADGE_COLORS, CandidateRole } from '../constants/badges';

// 1. Map the icons outside the component function
const ROLE_ICONS = {
  USER: BadgeCheck,
  DEALER: BadgeCheck,
  PREMIUM_DEALER: BadgeCheck,
  ADMIN: ShieldCheck,
  SUPERADMIN: ShieldAlert,
} as const;

export default function CandidateBadge({ role }: { role: CandidateRole }) {
 const lookupKey = (role || '').toUpperCase() as keyof typeof ROLE_ICONS;
  
  // 2. Fallback to standard BadgeCheck if the key is missing or invalid
  const Icon = ROLE_ICONS[lookupKey] || BadgeCheck;
  
  // 3. Fallback colors if the color configuration is missing
  const colors = BADGE_COLORS[lookupKey] || { stroke: 'text-blue-500', fill: 'fill-blue-500/10' };

  return (
    <Icon className={`w-5 h-5 ${colors.stroke} ${colors.fill}`} />
  );
}

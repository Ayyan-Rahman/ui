export const networks = [
  'discord',
  'email',
  'github',
  'medium',
  'other',
  'telegram',
  'twitter',
  'twitch',
  'website',
] as const;

export type Network = typeof networks[number];

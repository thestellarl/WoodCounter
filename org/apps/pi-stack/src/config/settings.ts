import * as storage from 'node-persist';

export async function getSettings(): Promise<{
  roundingAccuracy: number;
  boardLengthOffset: number;
}> {
  await storage.init();
  const settings = (await storage.getItem('settings')) || {
    roundingAccuracy: 0.25,
    boardLengthOffset: 0,
  };
  return settings;
}

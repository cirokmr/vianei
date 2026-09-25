import * as migration_20260925_201440_inicial from './20260925_201440_inicial';

export const migrations = [
  {
    up: migration_20260925_201440_inicial.up,
    down: migration_20260925_201440_inicial.down,
    name: '20260925_201440_inicial'
  },
];

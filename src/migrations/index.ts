import * as migration_20260925_201440_inicial from './20260925_201440_inicial';
import * as migration_20260925_205118_migracao_wordpress from './20260925_205118_migracao_wordpress';
import * as migration_20260925_212351_alt_provisorio from './20260925_212351_alt_provisorio';

export const migrations = [
  {
    up: migration_20260925_201440_inicial.up,
    down: migration_20260925_201440_inicial.down,
    name: '20260925_201440_inicial',
  },
  {
    up: migration_20260925_205118_migracao_wordpress.up,
    down: migration_20260925_205118_migracao_wordpress.down,
    name: '20260925_205118_migracao_wordpress',
  },
  {
    up: migration_20260925_212351_alt_provisorio.up,
    down: migration_20260925_212351_alt_provisorio.down,
    name: '20260925_212351_alt_provisorio'
  },
];

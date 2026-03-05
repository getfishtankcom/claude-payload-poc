import * as migration_20260305_220759_initial_schema from './20260305_220759_initial_schema';

export const migrations = [
  {
    up: migration_20260305_220759_initial_schema.up,
    down: migration_20260305_220759_initial_schema.down,
    name: '20260305_220759_initial_schema'
  },
];

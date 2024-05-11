import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'e2e',
      include: ['**/*.e2e-spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'integration',
      include: ['**/*.int-spec.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
    },
  },
])

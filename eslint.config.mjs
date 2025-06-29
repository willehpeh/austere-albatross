import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist']
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:domain',
              onlyDependOnLibsWithTags: ['scope:domain']
            },
            {
              sourceTag: 'scope:application',
              onlyDependOnLibsWithTags: [
                'scope:application',
                'scope:domain'
              ]
            },
            {
              sourceTag: 'scope:infrastructure',
              onlyDependOnLibsWithTags: [
                'scope:infrastructure',
                'scope:application',
                'scope:domain'
              ]
            },
            {
              sourceTag: 'scope:tests',
              onlyDependOnLibsWithTags: [
                'scope:tests',
                'scope:application',
                'scope:domain',
                'scope:infrastructure'
              ]
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: [
                'scope:api',
                'scope:application',
                'scope:domain',
                'scope:infrastructure'
              ]
            },
            {
              sourceTag: 'scope:frontend',
              onlyDependOnLibsWithTags: [
                'scope:frontend',
                'scope:api',
                'scope-application'
              ]
            }
          ]
        }
      ]
    }
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs'
    ],
    // Override or add rules here
    rules: {}
  }
];

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    'http://localhost:3000/graphql': {
      headers: {
        'Content-Type': 'application/json',
        'x-apollo-operation-name': 'IntrospectionQuery',
      },
    },
  },
  documents: ['src/graphql/**/*.graphql'],
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        '@graphql-codegen/typescript',
        '@graphql-codegen/typescript-operations',
        '@graphql-codegen/typescript-react-apollo',
      ],
      config: {
        useTypeImports: true,
        apolloReactHooksImportFrom: '@apollo/client',
      },
    },
  },
};

export default config;

import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:3000/graphql',
  documents: ['src/graphql/**/*.graphql'],
  generates: {
    './src/generated': {
      preset: 'client',
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;

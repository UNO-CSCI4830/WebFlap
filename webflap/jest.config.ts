/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 *
 * 
 * 
 * I initially used https://jestjs.io/docs/getting-started, specifically ran the command npm init jest@latest, but tests weren't
 * working, so I tried to find the right settings for react/typescript, ignoring css imports, etc, and this seems to work.
 * The transform is a little confusing, it just converts typescript to plain javascript so it can be run the tests it wants to.
**/

import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  // Ignore CSS imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // transform to js
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        verbatimModuleSyntax: false,
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },
};

export default config;

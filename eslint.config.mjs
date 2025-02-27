// @ts-check

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const flatCompat = new FlatCompat();

const config = tseslint.config(
  fixupConfigRules(flatCompat.extends('next/core-web-vitals')),
  fixupConfigRules(flatCompat.extends('next/typescript')),
  eslintPluginPrettierRecommended,
);

export default config;

import { Decorator, Parameters } from '@storybook/react';
import { withScreenshot } from 'storycap';

export const decorators: Decorator[] = [withScreenshot as Decorator];

export const parameters: Parameters = {
  screenshot: {},
};

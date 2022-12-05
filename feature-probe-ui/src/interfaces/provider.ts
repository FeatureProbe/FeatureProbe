/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContainerProviderProps } from 'unstated-next';
import { ReactElement } from 'react';

interface IFn {
  (): any;
}
  
export interface IContainer {
  Provider: React.ComponentType<ContainerProviderProps<void>>;
  useContainer: IFn;
}

export interface IChildren {
  children: ReactElement
}
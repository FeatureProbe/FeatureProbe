import { ReactElement } from 'react';
import { createContainer } from 'unstated-next';
import { IContainer, IChildren } from 'interfaces/provider';

import { useVarition, useRule, useDefaultServe, useDisabledServe, useReactHookForm, useSegment } from './hooks';

export const variationContainer: IContainer = createContainer(useVarition);
export const ruleContainer: IContainer = createContainer(useRule);
export const defaultServeContainer: IContainer = createContainer(useDefaultServe);
export const disabledServeContainer: IContainer = createContainer(useDisabledServe);
export const hooksFormContainer: IContainer = createContainer(useReactHookForm);
export const segmentContainer: IContainer = createContainer(useSegment);

function compose(...containers: IContainer[]) {
  return function Component(props: IChildren) {
    return containers.reduceRight((children: ReactElement, Container: IContainer) => {
      return <Container.Provider>{children}</Container.Provider>;
    }, props.children);
  };
}
  
export const Provider = compose(
  variationContainer, 
  ruleContainer, 
  defaultServeContainer, 
  disabledServeContainer, 
  hooksFormContainer,
  segmentContainer,
);
  
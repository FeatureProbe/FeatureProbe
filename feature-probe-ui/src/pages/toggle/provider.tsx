import { ReactElement } from 'react';
import { createContainer } from 'unstated-next';
import { IContainer, IChildren } from 'interfaces/provider';
import { useVarition, useToggleInfo, useReactHookForm } from './hooks';

export const variationContainer: IContainer = createContainer(useVarition);
export const toggleInfoContainer: IContainer = createContainer(useToggleInfo);
export const hooksFormContainer: IContainer = createContainer(useReactHookForm);

function compose(...containers: IContainer[]) {
  return function Component(props: IChildren) {
    return containers.reduceRight((children: ReactElement, Container: IContainer) => {
      return <Container.Provider>{children}</Container.Provider>;
    }, props.children);
  };
}
  
export const Provider = compose(variationContainer, toggleInfoContainer, hooksFormContainer);
  
import { ReactElement } from 'react';
import { createContainer } from 'unstated-next';
import { IContainer, IChildren } from 'interfaces/provider';
import { useWebHookInfo, useReactHookForm } from './hooks';

export const webHookInfoContainer = createContainer(useWebHookInfo);
export const hooksFormContainer = createContainer(useReactHookForm);

function compose(...containers: IContainer[]) {
  return function Component(props: IChildren) {
    return containers.reduceRight((children: ReactElement, Container: IContainer) => {
      return <Container.Provider>{children}</Container.Provider>;
    }, props.children);
  };
}
  
export const Provider = compose(webHookInfoContainer, hooksFormContainer);
  
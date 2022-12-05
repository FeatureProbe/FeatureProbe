import { ReactElement } from 'react';
import { createContainer } from 'unstated-next';
import { IContainer, IChildren } from 'interfaces/provider';
import { useTokenInfo, useReactHookForm } from './hooks';

export const tokenInfoContainer = createContainer(useTokenInfo);
export const hooksFormContainer = createContainer(useReactHookForm);

function compose(...containers: IContainer[]) {
  return function Component(props: IChildren) {
    return containers.reduceRight((children: ReactElement, Container: IContainer) => {
      return <Container.Provider>{children}</Container.Provider>;
    }, props.children);
  };
}
  
export const Provider = compose(tokenInfoContainer, hooksFormContainer);
  
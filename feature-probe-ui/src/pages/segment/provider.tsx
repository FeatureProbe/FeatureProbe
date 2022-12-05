import { ReactElement } from 'react';
import { createContainer } from 'unstated-next';
import { IContainer, IChildren } from 'interfaces/provider';
import { useSegmentInfo, useEnvironmentInfo, useReactHookForm } from './hooks';

export const segmentContainer: IContainer = createContainer(useSegmentInfo);
export const environmentContainer: IContainer = createContainer(useEnvironmentInfo);
export const hooksFormContainer: IContainer = createContainer(useReactHookForm);

function compose(...containers: IContainer[]) {
  return function Component(props: IChildren) {
    return containers.reduceRight((children: ReactElement, Container: IContainer) => {
      return <Container.Provider>{children}</Container.Provider>;
    }, props.children);
  };
}
  
export const Provider = compose(segmentContainer, environmentContainer, hooksFormContainer);
  
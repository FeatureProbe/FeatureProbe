import React, { ReactElement, SyntheticEvent } from 'react';
import { EventTrack } from 'utils/track';

interface IProps {
  category: string;
  action: string;
  children: ReactElement;
}

const EventTracker = (props: IProps) => {
  const { category, action, children } = props;
  const onClick = (e: SyntheticEvent) => {
    EventTrack.track(category, action);

    if (typeof children.props.onClick === 'function') {
      children.props.onClick(e);
    }
  };

  const onlychildren = React.Children.only(children);
  
  return React.cloneElement(
    onlychildren,
    {
      ...props,
      onClick: onClick,
    },
    children.props.children
  );
};

export default EventTracker;

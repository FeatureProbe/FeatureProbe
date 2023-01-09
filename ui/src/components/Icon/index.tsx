import React from 'react';

interface IProps extends React.HTMLProps<HTMLSpanElement> {
  type: string;
  customclass?: string;
}

const Icon = (props: IProps) => {
  const { type, customclass } = props;

  return (
   <span {...props} className={`iconfont icon-${type} ${customclass}`}></span>
  );
};
  
export default Icon;
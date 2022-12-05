import { useRef, MouseEvent, useCallback } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';

const CustomButton = ({children, ...props}: ButtonProps) => {
  const { onClick } = props;
  const buttonRef = useRef(null);
  
  const handleOnClick = useCallback((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, {...props}) => {
    // @ts-ignore object null compatibility
    buttonRef.current.ref?.current.blur();

    if (onClick) {
      onClick(e, props);
    }
  }, [onClick]);

  return (
    <Button {...props} ref={buttonRef} onClick={handleOnClick}>
      { children }
    </Button>
  );
};

export default CustomButton;
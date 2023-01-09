import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';
import { stringLimit } from '../../utils/tools';
import styles from './index.module.scss';

interface IProps {
  text: string;
  maxLength?: number;
  hidePopup?: boolean;
  popupRender?: ReactNode;
  maxWidth?: number;
  popupProps?: PopupProps;
}

const TextLimit: React.FC<IProps> = (props) => {
  const { text, maxLength, maxWidth, hidePopup, popupRender, popupProps } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLong, setIsLong] = useState<boolean>(false);

  const judgeLength: () => boolean = useCallback(() => {
    if (maxLength) {
      return text.length > maxLength;
    } else {
      if (ref.current) {
        return ref.current.scrollWidth > ref.current.clientWidth;
      } else {
        return false;
      }
    }
  }, [text, maxLength]);

  useEffect(() => {
    setIsLong(judgeLength());
  }, [judgeLength, text]);

  return hidePopup ? (
    <span
      className={`${maxLength ? styles['limit-str-container-n'] : styles['limit-str-container-w']}`}
      style={{
        maxWidth: maxWidth ?? '100%',
      }}
    >
      {stringLimit(text, maxLength ?? 0)}
    </span>
  ) : (
    <Popup
      inverted
      disabled={!isLong}
      trigger={
        <span
          className={`${maxLength ? styles['limit-str-container-n'] : styles['limit-str-container-w']}`}
          ref={ref}
          style={{
            maxWidth: maxWidth ?? '100%',
          }}
        >
          {stringLimit(text, maxLength ?? 0)}
        </span>
      }
      content={popupRender ?? text}
      className="popup-override"
      wide="very"
      {...popupProps}
    />
  );
};

export default TextLimit;

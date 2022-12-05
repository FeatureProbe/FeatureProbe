import { toast, ToastOptions, Slide } from 'react-toastify';
import styles from './index.module.scss';

interface IObject {
  [key: string]: string;
}

interface IFn {
  (content: string, duration?: number): void;
}
interface IFunc {
  [key: string]: IFn;
}

const iconObj: IObject = {
  info: 'icon-info-circle',
  success: 'icon-success-circle',
  warn: 'icon-warning-circle',
  error: 'icon-error-circle',
};


const options: ToastOptions = {
  position: 'top-center',
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  closeButton: false,
  transition: Slide,
  className: styles['message'],
};

const message: IFunc = {
  info: (content: string, duration?: number) => {
    toast.info(content, {
      ...options,
      icon: <i className={`${styles[iconObj['info']]} ${iconObj['info']} iconfont`}></i>,
      autoClose: duration || 3000,
    });
  },
  success: (content: string, duration?: number) => {
    toast.success(content, {
      ...options,
      icon: <i className={`${styles[iconObj['success']]} ${iconObj['success']} iconfont`}></i>,
      autoClose: duration || 3000,
    });
  },
  warn: (content: string, duration?: number) => {
    toast.warning(content, {
      ...options,
      icon: <i className={`${styles[iconObj['warn']]} ${iconObj['warn']} iconfont`}></i>,
      autoClose: duration || 3000,
    });
  },
  error: (content: string, duration?: number) => {
    toast.error(content, {
      ...options,
      icon: <i className={`${styles[iconObj['error']]} ${iconObj['error']} iconfont`}></i>,
      autoClose: duration || 3000,
    });
  }
};

export default message;

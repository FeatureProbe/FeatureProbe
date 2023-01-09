import { ReactElement } from 'react';
import SideBar from './sidebar';
import SettingSiderbar from './settingSiderbar';
import styles from './layout.module.scss';

interface IProps {
  children: ReactElement
}

const SettingLayout = (props: IProps) => {
  return (
    <div className={styles.main}>
      <SideBar>
        <SettingSiderbar />
      </SideBar>
      <div className={styles.content}>
        { props.children }
      </div>
    </div>
	);
};

export default SettingLayout;
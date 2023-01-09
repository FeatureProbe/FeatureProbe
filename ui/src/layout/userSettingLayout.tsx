import { ReactElement } from 'react';
import SideBar from './sidebar';
import SettingSiderbar from './userSettingSiderbar';
import styles from './layout.module.scss';

interface IProps {
  children: ReactElement
}

const UserSettingLayout = (props: IProps) => {
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

export default UserSettingLayout;
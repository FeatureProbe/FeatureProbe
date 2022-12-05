import ProjectLayout from 'layout/projectLayout';
import Info from './components/Info';
import { Provider } from './provider';

import styles from './index.module.scss';

const SegmentEdit = () => {

	return (
    <ProjectLayout>
      <Provider>
        <div className={styles.segments}>
          <div className={styles.card}>
            <Info />
          </div>
        </div>
      </Provider>
    </ProjectLayout>
	);
};

export default SegmentEdit;

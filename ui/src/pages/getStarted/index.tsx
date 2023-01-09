import ProjectLayout from 'layout/projectLayout';
import Steps from './components/Steps';
import styles from './index.module.scss';

const GetStarted = () => {

  return (
    <ProjectLayout>
      <div className={styles['get-started']}>
        <Steps />
      </div>
    </ProjectLayout>
  );
};

export default GetStarted;
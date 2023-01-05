import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { saveDictionary, getFromDictionary } from 'services/dictionary';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { IDictionary } from 'interfaces/targeting';
import { FLOW_EXPLAIN } from 'constants/dictionary_keys';

import styles from './index.module.scss';

const FlowExplain = () => {
  const [open, saveOpen] = useState<boolean>(false);
  const [modalOpen, saveModalOpen] = useState<boolean>(false);
  const intl  = useIntl();

  useEffect(() => {
    getFromDictionary<IDictionary>(FLOW_EXPLAIN).then(res => {
      if (res.success && res.data) {
        const savedData = JSON.parse(res.data.value);
        saveOpen(savedData);
      } else {
        saveOpen(true);
      }
    });
  }, []);

  const toggleFlowExplain = useCallback(() => {
    saveDictionary(FLOW_EXPLAIN, !open).then((res) => {
      if (res.success) {
        saveOpen(!open);
      }
    });
  }, [open]);

  return (
    <div className={styles['flow-explain']}>
      <div className={styles.left} onClick={toggleFlowExplain}>
        {
          open ? <Icon type='angle-right' /> : <Icon type='angle-left' />
        }
      </div>
      {
        open && <div className={styles.right} onClick={() => { saveModalOpen(true); }}>
          <div>
            <Icon type='flow' customclass={styles['icon-flow']} />
          </div>
          <FormattedMessage id='common.flow.explain' />
        </div>
      }

      <Modal 
        open={modalOpen}
        width={770}
        footer={<></>}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              <FormattedMessage id="common.flow.explain" />
            </span>
            <Icon customclass={styles['modal-close-icon']} type="close" onClick={() => { saveModalOpen(false); }} />
          </div>
          <div className={styles['modal-content']}>
            {
              intl.locale === 'zh-CN' ?  <img className={styles['modal-image']} src={require('images/flow-explain-zh.png')} alt='flow' /> 
              :  <img className={styles['modal-image']} src={require('images/flow-explain-en.png')} alt='flow' />
            }
           
          </div>
          <div className={styles['modal-footer']}>
            <Button size="mini" primary onClick={() => { saveModalOpen(false); }}>
              <FormattedMessage id="common.know.text" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlowExplain;

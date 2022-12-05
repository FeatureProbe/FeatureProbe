import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Form } from 'semantic-ui-react';
import { CONFLICT } from 'constants/httpCode';
import debounce from 'lodash/debounce';
import FormItem from 'components/FormItem';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import Modal from 'components/Modal';
import { TOKENTYPE } from 'interfaces/token';
import { hooksFormContainer, tokenInfoContainer } from '../../provider';
import { checkTokenNameExist, createToken } from 'services/tokens';
import TextLimit from 'components/TextLimit';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  handleCancel?: () => void;
  refresh?: () => unknown;
}

const TokenModal: React.FC<IProps> = (props) => {
  const { open, handleCancel, refresh } = props;
  const [loading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  const intl = useIntl();

  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    handleSubmit,
    clearErrors,
    setError,
  } = hooksFormContainer.useContainer();

  const { tokenInfo, init, handleChange } = tokenInfoContainer.useContainer();

  useEffect(() => {
    register('name', {
      required: {
        value: true,
        message: intl.formatMessage({ id: 'common.name.required' }),
      },
    });
  }, [register, intl]);

  const onClose = useCallback(() => {
    setValue('name', '');
    setValue('role', '');
    setStatus(false);
    init();
    clearErrors();
    handleCancel && handleCancel();
  }, [init, clearErrors, handleCancel, setValue]);

  const onCopy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        const clipboardObj = navigator.clipboard;
        await clipboardObj.writeText(token);
      } else {
        const tokenEle = document.getElementById('token');
        (tokenEle as HTMLInputElement).select();
        document.execCommand('copy');
      }
      onClose();
      message.success(intl.formatMessage({ id: 'common.copy.success.text' }));
    } catch (err) {
      console.error(err);
      message.error(intl.formatMessage({ id: 'common.copy.error.text' }));
    }
  }, [token, intl, onClose]);

  const onSubmit = useCallback(async () => {
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await createToken<{ token: string }>({
        type: TOKENTYPE.PERSON,
        name: tokenInfo.name,
      });

      if (res.success && res.data) {
        message.success(intl.formatMessage({ id: 'token.create.success' }));
        setStatus(true);
        setToken(res.data?.token);
        refresh && refresh();
      } else {
        message.error(res.message || intl.formatMessage({ id: 'token.create.error' }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [errors, tokenInfo, intl, refresh]);

  const checkNameExistCallback = useCallback(
    async (name: string) => {
      if (!name) {
        return;
      }
      const res = await checkTokenNameExist(name, TOKENTYPE.PERSON);
      if (res.code === CONFLICT) {
        setError('name', {
          message: res.message,
        });
      } else {
        clearErrors('name');
      }
    },
    [setError, clearErrors]
  );

  const checkNameExist = useMemo(() => debounce(checkNameExistCallback, 200), [checkNameExistCallback]);

  return (
    <Modal
      width={480}
      footer={<></>}
      handleCancel={() => {
        init();
        handleCancel && handleCancel();
      }}
      open={open}
    >
      <div>
        <div className={styles['modal-header']}>
          <span className={styles['modal-header-text']}>
            {status ? (
              <TextLimit
                maxWidth={300}
                text={intl.formatMessage({ id: 'token.created.modal.title' }, { name: tokenInfo.name })}
              />
            ) : (
              <FormattedMessage id="token.personal.create.text" />
            )}
          </span>
          <Icon customclass={styles['modal-close-icon']} type="close" onClick={onClose} />
        </div>
        {status && (
          <div className={styles['header-tips-container']}>
            <div className={styles['header-tips']}>
              <span className={styles['warning-circle']}>
                <Icon type="warning-circle" />
              </span>
              <FormattedMessage id="token.copy.tips" />
            </div>
          </div>
        )}
        {status ? (
          <div>
            <div className={styles['copy-token']}>
              <TextLimit text={tokenInfo.name} maxWidth={80} />
              <div>:</div>
              <input id="token" className={styles['token']} value={token} />
            </div>
            <div
              className={styles['footer']}
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
              }}
            >
              <Button size="mini" onClick={onCopy} primary>
                <FormattedMessage id="token.copy.text" />
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormItem
              className={styles['form-item-name']}
              error={errors.name}
              required
              label={<FormattedMessage id="token.form.name.text" />}
            >
              <Form.Input
                onChange={async (e, detail) => {
                  handleChange(detail, 'name');
                  setValue('name', detail.value);
                  checkNameExist(detail.value);
                  await trigger('name');
                }}
                error={errors.name ? true : false}
                name="name"
                placeholder={intl.formatMessage({ id: 'common.name.required' })}
              />
            </FormItem>
            <div
              className={styles['footer']}
              onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
              }}
            >
              <Button size="mini" className={styles['btn']} basic type="reset" onClick={onClose}>
                <FormattedMessage id="common.cancel.text" />
              </Button>
              <Button
                size="mini"
                loading={loading}
                disabled={loading || Object.keys(errors).length > 0}
                type="submit"
                primary
              >
                <FormattedMessage id="common.confirm.text" />
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default TokenModal;

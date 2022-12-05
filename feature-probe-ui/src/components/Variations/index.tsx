import { useCallback, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import VariationItem from 'components/VariationItem';
import Button from 'components/Button';
import Icon from 'components/Icon';
import uniqBy from 'lodash/uniqBy';
import { IVariation } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import { useFormErrorScrollIntoView } from 'hooks';
import styles from './index.module.scss';
interface IProps {
  disabled?: boolean;
  returnType: string;
  prefix?: string;
  variationContainer: IContainer;
  hooksFormContainer: IContainer
}

const Variations = (props: IProps) => {
  const { disabled, returnType, prefix, variationContainer, hooksFormContainer } = props;
  const [ isError, setIsError ] = useState<boolean>(false);
  const intl = useIntl();

  const {
    variations,
    handleAdd,
    handleInput,
    handleDelete,
    handleChangeVariation,
  } = variationContainer.useContainer();

  const {
    unregister,
    setError,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const { registerErrorName } = useFormErrorScrollIntoView();

  const handleDeleteVariation = useCallback((index: number, variationId?: string) => {
    unregister(`variation_${variationId}_name`);
    unregister(`variation_${variationId}`);
    handleDelete(index);
  }, [handleDelete, unregister]);

  useEffect(() => {
    if (variations?.length > 0) {
      setIsError(false);
      // const valueNotNullVariations = variations.filter((variation: IVariation) => {
      //   return variation.value !== '';
      // });
      // const len = valueNotNullVariations.length;

      // const uniqValueLen = uniqBy(valueNotNullVariations, 'value').length; 
      // if (uniqValueLen !== len) {
      //   setIsError(true);
      //   setErrorType('value');
      //   return;
      // }

      const nameNotNullVariations = variations.filter((variation: IVariation) => {
        return variation.name !== '';
      });

      const length = nameNotNullVariations.length;
      if (length === 0) {
        return;
      }

      const uniqNameLen = uniqBy(nameNotNullVariations, 'name').length;
      if (uniqNameLen !== nameNotNullVariations.length) {
        setIsError(true);
        return;
      }
    }
  }, [variations]);

  useEffect(() => {
    if (isError) {
      setError(
        'variations_duplicated', { 
          message: intl.formatMessage({
            id: 'variations.duplicated.error.text'
          })
        });
    } else {
      clearErrors('variations_duplicated');
    }
  }, [intl, isError, setError, clearErrors]);

	return (
		<div className={styles.variation}>
      {
         variations?.map((variation: IVariation, index: number) => (
          <VariationItem
            disabled={disabled}
            key={variation.id}
            returnType={returnType}
            total={variations.length}
            item={{
              index, 
              ...variation
            }}
            prefix={prefix}
            handleInput={handleInput}
            handleDelete={() => handleDeleteVariation(index, variation.id)}
            handleChangeVariation={handleChangeVariation}
            hooksFormContainer={hooksFormContainer}
          />
        ))
      }

      <div className={styles[`${prefix ? (prefix + '-') : ''}variation-add`]}>
        <Button 
          primary
          type='button'
          onClick={handleAdd}
          disabled={variations.length >= 20 || disabled} 
          className={styles['variation-add-btn']} 
        >
          <>
            <Icon customclass={styles['iconfont']} type='add' />
            <span className={styles['variation-add-btn-text']}>
              <FormattedMessage id='variations.add.text' />
            </span>
          </>
        </Button>
      </div>
      {
        isError && <div {...registerErrorName('variations_duplicated')} className={styles['error-text']}>
          {
            intl.formatMessage({
              id: 'variations.duplicated.error.text'
            })
          }
        </div>
      }

		</div>
	);
};

export default Variations;
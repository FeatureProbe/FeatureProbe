import { Dimmer, DimmerProps, Loader } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

const Loading = (props: DimmerProps) => {
  return (
    <Dimmer active inverted {...props}>
      <Loader size='small'>
        <FormattedMessage id='common.loading.text' />
      </Loader>
    </Dimmer>
  );
};

export default Loading;
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import message from '.';
import { IntlWrapper } from 'components/utils/wrapper';
import sleep from 'utils/sleep';

jest.setTimeout(20000);

test('message', (done) => {
  (async () => {
    const { baseElement } = render(<div></div>, { wrapper: IntlWrapper });
    message.info('test text');
    message.success('test text');
    message.warn('test text');
    message.error('test text');
    await sleep(5000);
    expect(baseElement).toMatchSnapshot();
    done();
  })();
});

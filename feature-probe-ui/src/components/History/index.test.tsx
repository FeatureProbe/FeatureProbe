import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { IntlWrapper } from 'components/utils/wrapper';
import History from '.';
import segmentResponse from './mockData/segmentResponse.json';
import targetResponse from './mockData/targetResponse.json';
import sleep from 'utils/sleep';

it('History snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(
      <History
        versions={[]}
        hasMore={true}
        latestVersion={0}
        loadMore={jest.fn()}
        selectedVersion={0}
        isHistoryLoading={false}
        reviewHistory={jest.fn()}
      />,
      {
        wrapper: IntlWrapper,
      }
    );

    expect(asFragment()).toMatchSnapshot();

    rerender(<History
      versions={[]}
      hasMore={true}
      latestVersion={0}
      loadMore={jest.fn()}
      selectedVersion={0}
      isHistoryLoading={true}
      reviewHistory={jest.fn()}
    />);

    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('History render segment data', (done) => {
  (async () => {
    const load = jest.fn().mockResolvedValue(segmentResponse);

    const mock = jest.fn();
    const { asFragment, rerender } = render(
      <History
        versions={segmentResponse.content}
        hasMore={true}
        latestVersion={segmentResponse.content[0].version}
        loadMore={load}
        selectedVersion={0}
        isHistoryLoading={false}
        reviewHistory={mock}
      />,
      {
        wrapper: IntlWrapper,
      }
    );

    expect(asFragment()).toMatchSnapshot();

    await userEvent.click(screen.getByText('Load more'));
    await sleep(0);

    expect(asFragment()).toMatchSnapshot();

    await userEvent.click(screen.getByText('7'));
    expect(mock).toBeCalledWith(expect.objectContaining({ version: 7 }));

    rerender(
      <History
        versions={segmentResponse.content}
        hasMore={true}
        latestVersion={segmentResponse.content[0].version}
        loadMore={load}
        selectedVersion={7}
        isHistoryLoading={false}
        reviewHistory={mock}
      />
    );
    await userEvent.click(screen.getByText('7'));
    expect(mock).toBeCalledTimes(1);
    done();
  })();
});

test('History render target data', (done) => {
  (async () => {
    const load = jest.fn().mockResolvedValue(targetResponse);

    const mock = jest.fn();
    const { asFragment } = render(
      <History
        versions={targetResponse.content}
        hasMore={true}
        latestVersion={targetResponse.content[0].version}
        loadMore={load}
        selectedVersion={0}
        isHistoryLoading={false}
        reviewHistory={mock}
      />,
      {
        wrapper: IntlWrapper,
      }
    );

    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});



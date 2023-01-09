import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { SidebarContainer } from 'layout/hooks';
import { useEffect } from 'react';
import { IntlWrapper } from 'components/utils/wrapper';
import PutAway from '.';

const TrueWrapper: React.FC = (props) => {
  return (
    <IntlWrapper>
      <SidebarContainer.Provider>
        <UseHookWrapper isPutAway={true}>
          {props.children}
          <div id="footer"></div>
        </UseHookWrapper>
      </SidebarContainer.Provider>
    </IntlWrapper>
  );
};

const FalseWrapper: React.FC = (props) => {
  return (
    <IntlWrapper>
      <SidebarContainer.Provider>
        <UseHookWrapper isPutAway={false}>{props.children}</UseHookWrapper>
      </SidebarContainer.Provider>
    </IntlWrapper>
  );
};

const UseHookWrapper: React.FC<{ isPutAway?: boolean }> = ({ children, isPutAway }) => {
  const { setIsputAway } = SidebarContainer.useContainer();

  useEffect(() => {
    setIsputAway(isPutAway);
  }, [isPutAway]);

  return <>{children}</>;
};

it('PutAway true snapshot', (done) => {
  (async () => {
    const { baseElement } = render(<PutAway />, {
      wrapper: TrueWrapper,
    });
    expect(baseElement).toMatchSnapshot();

    done();
  })();
});

it('PutAway false snapshot', (done) => {
  (async () => {
    const { baseElement } = render(<PutAway />, {
      wrapper: FalseWrapper,
    });
    expect(baseElement).toMatchSnapshot();

    done();
  })();
});

test('click PutAway', (done) => {
  (async () => {
    const { asFragment } = render(<PutAway />, {
      wrapper: FalseWrapper,
    });

    await userEvent.click(screen.getByText('Collapse'));
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

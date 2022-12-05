import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Variations from '.';
import { hooksFormContainer, variationContainer } from 'pages/toggle/provider';
import { IntlWrapper } from 'components/utils/wrapper';
import { useEffect } from 'react';

const Wrapper: React.FC = (props) => {
  return (
    <IntlWrapper>
      <hooksFormContainer.Provider>
        <variationContainer.Provider>
          <UseHookWrapper
            data={[
              {
                id: 'test_id',
                value: '',
                name: 'name',
                description: '',
              },
            ]}
          >
            {props.children}
          </UseHookWrapper>
        </variationContainer.Provider>
      </hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

const ErrorWrapper: React.FC = (props) => {
  return (
    <IntlWrapper>
      <hooksFormContainer.Provider>
        <variationContainer.Provider>
          <UseHookWrapper
            data={[
              {
                id: 'test_id',
                value: '',
                name: 'name',
                description: '',
              },
              {
                id: 'test_id2',
                value: '',
                name: 'name',
                description: '',
              },
            ]}
          >
            {props.children}
          </UseHookWrapper>
        </variationContainer.Provider>
      </hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

const UseHookWrapper: React.FC<{ data: unknown }> = ({ children, data }) => {
  const { saveVariations } = variationContainer.useContainer();

  useEffect(() => {
    saveVariations(data);
  }, [saveVariations, data]);

  return <>{children}</>;
};

it('Variations snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(
      <Variations
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <Variations
        returnType="number"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <Variations
        returnType="string"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <Variations
        returnType="json"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

it('Variations error name', (done) => {
  (async () => {
    const { asFragment } = render(
      <Variations
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />,
      {
        wrapper: ErrorWrapper,
      }
    );
    
    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('Add Variations and delete', (done) => {
  (async () => {
    const { baseElement } = render(
      <Variations
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByText('Add Variation'));
    await userEvent.click(screen.getByText('Add Variation'));
    await userEvent.click(screen.getByText('Add Variation'));

    const matchDiv = document.createElement('div');
    matchDiv.innerHTML = baseElement.innerHTML?.replaceAll(/\sname="variation_[\w-]+\w" /g, ' name="test-name"');

    expect(matchDiv).toMatchSnapshot();

    const dels = document.querySelectorAll('span.icon-minus');
    await userEvent.click(dels[0]);
    matchDiv.innerHTML = baseElement.innerHTML?.replaceAll(/\sname="variation_[\w-]+\w" /g, ' name="test-name"');
    expect(matchDiv).toMatchSnapshot();

    done();
  })();
});

test('Add Variations and input', (done) => {
  (async () => {
    render(
      <Variations
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByText('Add Variation'));
    await userEvent.click(screen.getByText('Add Variation'));
    await userEvent.click(screen.getByText('Add Variation'));

    await userEvent.type(screen.getAllByPlaceholderText('name')[0], 'name');
    await userEvent.type(screen.getAllByPlaceholderText('name')[1], 'name');

    done();
  })();
});

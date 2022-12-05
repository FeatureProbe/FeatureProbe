import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import userEvent from '@testing-library/user-event';
import { Form } from 'semantic-ui-react';
import React, { useEffect } from 'react';
import RuleTitle from '.';
import { IntlWrapper } from 'components/utils/wrapper';
import { hooksFormContainer, ruleContainer, variationContainer } from 'pages/targeting/provider';
import { IRule } from 'interfaces/targeting';

const RuleData = {
  id: 'test_id',
  name: '',
  serve: undefined,
  conditions: [],
  active: true,
};

const Wrapper: React.FC = ({ children }) => {
  return (
    <IntlWrapper>
      <hooksFormContainer.Provider>
        <ruleContainer.Provider>
          <variationContainer.Provider>
            <Form>
              <DragDropContext onDragEnd={jest.fn()}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <div>
                        <UseHookWrapper>{children}</UseHookWrapper>
                      </div>
                      Í{provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Form>
          </variationContainer.Provider>
        </ruleContainer.Provider>
      </hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

const UseHookWrapper: React.FC = ({ children }) => {
  const { saveRules } = ruleContainer.useContainer();
  const { setValue } = hooksFormContainer.useContainer();

  useEffect(() => {
    const rule: IRule = {
      id: 'test_id',
      name: '',
      serve: undefined,
      conditions: [],
      active: true,
    };
    saveRules([rule, { ...rule, id: 'test_id2' }]);
    setValue('test_value_key', 'test_value');
  }, [saveRules, setValue]);

  return <>{children}</>;
};

it('RuleTitle snapshot', (done) => {
  const { asFragment, rerender } = render(
    <RuleTitle
      rule={RuleData}
      index={0}
      subjectOptions={[]}
      ruleContainer={ruleContainer}
      hooksFormContainer={hooksFormContainer}
    />,
    {
      wrapper: Wrapper,
    }
  );

  expect(asFragment()).toMatchSnapshot();

  rerender(
    <RuleTitle
      rule={RuleData}
      index={0}
      subjectOptions={[]}
      ruleContainer={ruleContainer}
      hooksFormContainer={hooksFormContainer}
      disabled={true}
    />
  );

  done();
});

test('RuleTitle opt', (done) => {
  (async () => {
    const { asFragment } = render(
      <RuleTitle
        rule={RuleData}
        index={0}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
        variationContainer={variationContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    const ruleTextbox = screen.getByPlaceholderText('Rule 1');
    await userEvent.hover(ruleTextbox);
    await userEvent.click(ruleTextbox);
    await userEvent.keyboard('test rule');
    await userEvent.type(ruleTextbox, 'test rule long long long long long long long long long long long long long long long');

    const del = document.querySelector('span.icon-archive');
    del && (await userEvent.click(del));
    const cancel = screen.queryByText('Cancel');
    expect(cancel).not.toBeNull();

    cancel && (await userEvent.click(cancel));

    del && (await userEvent.click(del));
    const confirm = screen.queryByText('Confirm');
    expect(confirm).not.toBeNull();

    confirm && (await userEvent.click(confirm));

    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

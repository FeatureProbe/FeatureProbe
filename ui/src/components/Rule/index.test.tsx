import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import userEvent from '@testing-library/user-event';
import Rule from '.';
import sleep from 'utils/sleep';
import { IntlWrapper } from 'components/utils/wrapper';
import { hooksFormContainer, ruleContainer } from 'pages/targeting/provider';
import { useEffect } from 'react';

const RuleData = {
  id: 'testId1',
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
        </ruleContainer.Provider>
      </hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

const UseHookWrapper: React.FC = ({ children }) => {
  const { saveRules } = ruleContainer.useContainer();

  useEffect(() => {
    saveRules([
      RuleData
    ]);
  }, [saveRules]);

  return <>{children}</>;
};

it('Rule snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(
      <Rule
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

    rerender(<Rule
      rule={RuleData}
      disabled
      active
      index={0}
      subjectOptions={[]}
      ruleContainer={ruleContainer}
      hooksFormContainer={hooksFormContainer}
    />);
    done();
  })();
});

test('Add conditions', (done) => {
  (async () => {
    const { baseElement } = render(
      <Rule
        rule={RuleData}
        index={0}
        useSegment={true}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );
    await sleep(100);

    const addBtn = screen.getByText('Add');
    await userEvent.click(addBtn);
    
    const addString =  screen.queryByText('string');
    expect(addString).not.toBe(null);

    if(addString) await userEvent.click(addString);
    const replacedEle = document.createElement('body');
    replacedEle.innerHTML = baseElement.innerHTML?.replaceAll(/\sname="rule_testId1_[\w-]+\w" /g, (_, i) => {
      return ` name="test-name-${i}"`;
    });
    expect(replacedEle).toMatchSnapshot();

    await userEvent.unhover(addBtn);
    await sleep(100);
    expect(addString).not.toBeInTheDocument();

    done();
  })();
});

test('Click Title', (done) => {
  (async () => {
    render(
      <Rule
        rule={RuleData}
        index={0}
        useSegment={true}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );
    
    const spans = screen.queryAllByRole('generic');
    const title = spans.find((value) => {
      return value.className.split(' ')[1] === 'title';
    });
    if(title) await userEvent.click(title);
    await sleep(200);
    
    expect(title?.className.split(' ')[0]).not.toBe('active');

    done();
  })();
});
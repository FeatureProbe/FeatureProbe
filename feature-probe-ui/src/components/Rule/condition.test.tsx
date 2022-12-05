import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Condition from './condition';
import { ICondition } from 'interfaces/targeting';
import { hooksFormContainer, ruleContainer, segmentContainer } from 'pages/targeting/provider';
import { IntlWrapper } from 'components/utils/wrapper';
import { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import { ISegmentList } from 'interfaces/segment';
import { variationContainer } from 'pages/toggle/provider';

const ruleData = {
  id: 'test-id',
  name: '',
  serve: undefined,
  conditions: [
    { id: 'c-test-id', type: 'string', subject: 'test', predicate: 'is one of', objects: ['test'], timezone: '+08:00' },
  ],
  active: true,
};

const Wrapper: React.FC = ({ children }) => {
  return (
    <IntlWrapper>
      <hooksFormContainer.Provider>
        <ruleContainer.Provider>
          <segmentContainer.Provider>
            <UseHookWrapper>
              <Form>{children}</Form>
            </UseHookWrapper>
          </segmentContainer.Provider>
        </ruleContainer.Provider>
      </hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

const segmentList: ISegmentList = {
  content: [
    {
      name: 'test',
      key: 'key',
      description: '',
      createdTime: '',
      createdBy: '',
      modifiedBy: '',
      modifiedTime: '',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  sort: {
    sorted: true,
    unsorted: false,
    empty: false,
  },
  first: true,
  last: true,
  size: 1,
  empty: false,
  numberOfElements: 1,
  number: 1,
  pageable: {
    sort: {
      sorted: true,
      unsorted: false,
      empty: false,
    },
    pageNumber: 1,
    pageSize: 1,
    paged: true,
    unpaged: false,
    offset: 0,
  },
};

const UseHookWrapper: React.FC = ({ children }) => {
  const { saveRules } = ruleContainer.useContainer();
  const { saveSegmentList } = segmentContainer.useContainer();

  useEffect(() => {
    saveRules([ruleData]);
    saveSegmentList(segmentList);
  }, [saveRules, saveSegmentList]);

  return <>{children}</>;
};

it('RuleContent snapshot', (done) => {
  (async () => {
    const { asFragment } = render(
      <Condition
        rule={ruleData}
        ruleIndex={0}
        conditionIndex={0}
        condition={{} as ICondition}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

it('RuleContent snapshot 2', (done) => {
  (async () => {
    const { asFragment } = render(
      <Condition
        rule={ruleData}
        ruleIndex={0}
        conditionIndex={0}
        condition={{} as ICondition}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
        disabled
        segmentContainer={segmentContainer}
        useSegment
        variationContainer={variationContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

test('RuleContent normal input', (done) => {
  (async () => {
    const { asFragment } = render(
      <Condition
        rule={ruleData}
        ruleIndex={0}
        conditionIndex={0}
        condition={ruleData.conditions[0]}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByText('Enter a subject'));
    await userEvent.keyboard('test text');

    expect(asFragment()).toMatchSnapshot();
    await userEvent.keyboard('{Enter}');

    await userEvent.click(screen.getAllByText('is one of')[0]);
    await userEvent.click(screen.getByText('is not any of'));
    expect(screen.getAllByText('is not any of').length).toBe(2);

    await userEvent.click(screen.getByText('Enter some values'));
    await userEvent.keyboard('test text');
    await userEvent.keyboard('{Enter}');

    await userEvent.keyboard('test text 2');
    await userEvent.keyboard('{Enter}');

    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('RuleContent number input', (done) => {
  (async () => {
    const conditions = [{ id: 'c-test-id', type: 'number', subject: '', predicate: '', objects: [] }];
    const { asFragment } = render(
      <Condition
        rule={{
          ...ruleData,
          conditions: conditions,
        }}
        ruleIndex={0}
        conditionIndex={0}
        condition={conditions[0]}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByText('Enter a subject'));
    await userEvent.keyboard('test text');
    await userEvent.keyboard('{Enter}');

    await userEvent.click(screen.getAllByText('Select an operator')[0]);
    await userEvent.click(screen.getByText('>='));
    expect(screen.getAllByText('>=').length).toBe(1);

    await userEvent.click(screen.getByText('Enter some values'));
    await userEvent.keyboard('test number');
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByDisplayValue('test number')).toBeNull();

    await userEvent.keyboard('100');
    await userEvent.keyboard('{Enter}');

    await userEvent.keyboard('200');
    await userEvent.keyboard('{Enter}');

    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('RuleContent semver input', (done) => {
  (async () => {
    const conditions = [{ id: 'c-test-id', type: 'semver', subject: '', predicate: '', objects: [] }];
    const { asFragment } = render(
      <Condition
        rule={{
          ...ruleData,
          conditions: conditions,
        }}
        ruleIndex={0}
        conditionIndex={0}
        condition={conditions[0]}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByText('Enter a subject'));
    await userEvent.keyboard('test text');
    await userEvent.keyboard('{Enter}');

    await userEvent.click(screen.getAllByText('Select an operator')[0]);
    await userEvent.click(screen.getByText('>='));
    expect(screen.getAllByText('>=').length).toBe(1);

    await userEvent.click(screen.getByText('Enter some values'));
    await userEvent.keyboard('test number');
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByText('test number')?.getAttribute('value')).toBeNull();

    await userEvent.keyboard('100');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('200');
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByText('100')?.getAttribute('value')).not.toBeNull();
    expect(screen.queryByText('200')?.getAttribute('value')).toBeNull();

    const ele = document.getElementsByClassName('icon-question')[0];
    await userEvent.click(ele);

    await userEvent.click(screen.getByText('Learn more'));

    expect(asFragment()).toMatchSnapshot();
    done();
  })();
});

test('RuleContent datetime input', (done) => {
  (async () => {
    const datetimeData = {
      ...ruleData,
    };
    datetimeData.conditions = [
      { id: 'c-test-id', type: 'datetime', subject: '', predicate: '', objects: [], timezone: '+08:00' },
    ];

    const { baseElement } = render(
      <Condition
        rule={datetimeData}
        ruleIndex={0}
        conditionIndex={0}
        condition={datetimeData.conditions[0]}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByPlaceholderText('Please select'));
    await userEvent.click(screen.getByText('20'));

    await userEvent.click(screen.getAllByText('UTC +8')[0]);
    await userEvent.click(screen.getByText('UTC +3'));

    baseElement.innerHTML = baseElement.innerHTML
      .replaceAll(/(\d\d\/\d\d\/\d\d\d\d )*\d\d:\d\d:\d\d/g, 'test_value')
      .replaceAll(' rdtActive rdtToday', '');

    expect(baseElement).toMatchSnapshot();
    done();
  })();
});

test('RuleContent segment render', (done) => {
  (async () => {
    const datetimeData = {
      ...ruleData,
    };
    datetimeData.conditions = [
      { id: 'c-test-id', type: 'segment', subject: '', predicate: '', objects: [], timezone: '+08:00' },
    ];

    const { baseElement } = render(
      <Condition
        rule={datetimeData}
        ruleIndex={0}
        conditionIndex={0}
        condition={datetimeData.conditions[0]}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
        segmentContainer={segmentContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    baseElement.innerHTML = baseElement.innerHTML.replaceAll(' rdtActive rdtToday', '');

    expect(baseElement).toMatchSnapshot();

    done();
  })();
});

test('RuleContent other opt', (done) => {
  (async () => {
    render(
      <Condition
        rule={ruleData}
        ruleIndex={0}
        conditionIndex={0}
        condition={ruleData.conditions[0]}
        subjectOptions={[]}
        ruleContainer={ruleContainer}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );

    const delBtn = screen.getAllByRole('generic').pop();
    expect(delBtn).not.toBeUndefined();
    expect(delBtn).toMatchSnapshot();
    delBtn && (await userEvent.click(delBtn));

    done();
  })();
});

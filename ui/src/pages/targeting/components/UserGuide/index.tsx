import { useCallback, useEffect, useState } from 'react';
import Joyride, { CallBackProps, EVENTS, ACTIONS, Step } from 'react-joyride';
import { FormattedMessage, useIntl } from 'react-intl';
import { commonConfig, floaterStyle, tourStyle } from 'constants/tourConfig';
import { getFromDictionary, saveDictionary } from 'services/dictionary';
import { USER_GUIDE_LAYOUT, USER_GUIDE_TARGETING } from 'constants/dictionaryKeys';
import { IDictionary } from 'interfaces/targeting';

const STEPS: Step[] = [
  {
    content: (
      <div>
        <div className="joyride-title">
          <FormattedMessage id="guide.toggle.targeting.step1.title" />
        </div>
        <ul className="joyride-item">
          <li>
            <FormattedMessage id="guide.toggle.targeting.step1.off" />
          </li>
          <li>
            <FormattedMessage id="guide.toggle.targeting.step1.on" />
          </li>
        </ul>
        <div className="joyride-pagination">1/2</div>
      </div>
    ),
    spotlightPadding: 20,
    placement: 'right',
    target: '.joyride-toggle-status',
    ...commonConfig,
  },
  {
    content: (
      <div>
        <div className="joyride-title">
          <FormattedMessage id="guide.toggle.targeting.step2.title" />
        </div>
        <ul className="joyride-item">
          <li>
            <FormattedMessage id="guide.toggle.targeting.step2.default" />
          </li>
        </ul>
        <div className="joyride-pagination">2/2</div>
      </div>
    ),
    spotlightPadding: 4,
    placement: 'right',
    target: '.joyride-default-rule',
    ...commonConfig,
  },
];

const UserGuide = () => {
  const [run, saveRun] = useState<boolean>(false);
  const [stepIndex, saveStepIndex] = useState<number>(0);
  const intl = useIntl();

  useEffect(() => {
    Promise.all([
      getFromDictionary<IDictionary>(USER_GUIDE_LAYOUT),
      getFromDictionary<IDictionary>(USER_GUIDE_TARGETING),
    ]).then((res) => {
      // After finishing layout user guide, then show targeting user guide
      if (res[0].success && res[0].data && parseInt(JSON.parse(res[0].data.value)) === 3) {
        const { success, data } = res[1];
        if (success && data) {
          const savedData = JSON.parse(data.value);
          if (parseInt(savedData) !== STEPS.length) {
            setTimeout(() => {
              saveRun(true);
            }, 0);
            saveStepIndex(parseInt(savedData));
          }
        } else {
          setTimeout(() => {
            saveRun(true);
          }, 0);
        }
      }
    });
  }, []);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      saveStepIndex(nextStepIndex);
      saveDictionary(USER_GUIDE_TARGETING, nextStepIndex);
    }
  }, []);

  return (
    <Joyride
      run={run}
      callback={handleJoyrideCallback}
      stepIndex={stepIndex}
      continuous
      hideCloseButton
      scrollToFirstStep
      showProgress={false}
      showSkipButton
      scrollOffset={100}
      disableCloseOnEsc={true}
      steps={STEPS}
      locale={{
        back: intl.formatMessage({ id: 'guide.last' }),
        next: intl.formatMessage({ id: 'guide.next' }),
        last: intl.formatMessage({ id: 'guide.done' }),
      }}
      floaterProps={{ ...floaterStyle }}
      styles={{ ...tourStyle }}
    />
  );
};

export default UserGuide;

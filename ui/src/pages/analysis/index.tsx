
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import Metrics from './components/Metrics';
import Results from './components/Results';
import { IEvent } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { getEventDetail, operateCollection } from 'services/analysis';
import { ITarget } from 'interfaces/targeting';

interface IProps {
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  targeting?: ITarget;
  initTargeting(): void;
}

const Analysis = (props: IProps) => {
  const { trackEvents, targeting, allowEnableTrackEvents, initTargeting } = props;
  const [ eventInfo, saveEventInfo ] = useState<IEvent>();
  const [ submitLoading, saveSubmitLoading ] = useState<boolean>(false);
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  useEffect(() => {
    getEventDetail<IEvent>(projectKey, environmentKey, toggleKey).then(res => {
      if (res.success && res.data) {
        saveEventInfo(res.data);
      }
    });
  }, [environmentKey, intl, projectKey, toggleKey]);

  const operateTrackCollection = useCallback(trackEvents => {
    saveSubmitLoading(true);
    operateCollection(projectKey, environmentKey, toggleKey, {
      trackAccessEvents: trackEvents
    }).then(res => {
      if (res.success) {
        initTargeting();
      }
      saveSubmitLoading(false);
    });
  }, [environmentKey, projectKey, toggleKey, initTargeting]);

  return (
    <div>
      <Metrics 
        eventInfo={eventInfo}
        initTargeting={initTargeting}
      />
      <Results 
        eventInfo={eventInfo}
        targeting={targeting}
        trackEvents={trackEvents}
        submitLoading={submitLoading}
        allowEnableTrackEvents={allowEnableTrackEvents}
        operateTrackCollection={operateTrackCollection}
      />
    </div>
  );
};

export default Analysis;

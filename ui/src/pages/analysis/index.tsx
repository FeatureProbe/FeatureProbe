
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { IEvent } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { getEventDetail, operateCollection } from 'services/analysis';
import Metrics from './components/Metrics';
import Results from './components/Results';

interface IProps {
  trackEvents: boolean;
  allowEnableTrackEvents: boolean;
  initTargeting(): void;
}

const Analysis = (props: IProps) => {
  const { trackEvents, allowEnableTrackEvents, initTargeting } = props;
  const [ eventInfo, saveEventInfo ] = useState<IEvent>();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const intl = useIntl();

  useEffect(() => {
    getEventDetail<IEvent>(projectKey, environmentKey, toggleKey).then(res => {
      if (res.success && res.data) {
        saveEventInfo(res.data);
      }
    });
  }, [environmentKey, intl, projectKey, toggleKey]);

  const operateTrackCollection = useCallback((trackEvents: boolean) => {
    operateCollection(projectKey, environmentKey, toggleKey, {trackAccessEvents: trackEvents}).then(res => {
      if (res.success) {
        initTargeting();
      }
    });
  }, [environmentKey, projectKey, toggleKey, initTargeting]);

  return (
    <div>
      <Metrics 
        eventInfo={eventInfo}
      />
      <Results 
        eventInfo={eventInfo}
        trackEvents={trackEvents}
        allowEnableTrackEvents={allowEnableTrackEvents}
        operateTrackCollection={operateTrackCollection}
      />
    </div>
  );
};

export default Analysis;


import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { IEvent } from 'interfaces/analysis';
import { IRouterParams } from 'interfaces/project';
import { getEventDetail } from 'services/analysis';
import Metrics from './components/Metrics';
import Results from './components/Results';

const Analysis = () => {
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

  return (
    <div>
      <Metrics 
        eventInfo={eventInfo}
      />
      <Results 
        eventInfo={eventInfo}
      />
    </div>
  );
};

export default Analysis;

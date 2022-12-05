import { useEffect, useCallback, useState, Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { FPUser, FeatureProbe } from 'featureprobe-client-sdk-js';
import { headerRoutes, blankRoutes } from './routes';
import Loading from 'components/Loading';
import { getRedirectUrl } from 'utils/getRedirectUrl';
import BasicLayout from 'layout/BasicLayout';
import { EventTrack } from 'utils/track';

let USER: FPUser;
let FP: FeatureProbe;

const Router = () => {
  const [ redirectUrl, setRedirectUrl ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  const initRedirectUrl = useCallback(async () => {
    if (window.location.pathname === '/login') {
      return;
    }
    const redirectUrl = await getRedirectUrl('/notfound');
    setRedirectUrl(redirectUrl);
  }, []);

  useEffect(() => {
    EventTrack.init();
  }, []);

  const init = useCallback(async() => {
    if (!USER) {
      USER = new FPUser();
    }

    if (!FP) {
      FP = new FeatureProbe({
        togglesUrl: window.location.origin + '/server/api/client-sdk/toggles',
        eventsUrl:  window.location.origin + '/server/api/events',
        clientSdkKey: 'client-29765c7e03e9cb49c0e96357b797b1e47e7f2dee',
        user: USER,
        refreshInterval: 500000,
      });

      window.FP = FP;

      FP.on('ready', () => {
        const result = FP.boolValue('demo_features', false);
        localStorage.setItem('isDemo', result.toString());
        setIsLoading(false);
        initRedirectUrl();
      });

      FP.on('error', () => {
        setIsLoading(false);
        initRedirectUrl();
      });

      FP.start();
    }
  }, [initRedirectUrl]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      {
        isLoading ? <Loading /> : (
            <Suspense fallback={<Loading />}>
              <BrowserRouter>
                <Switch>
                  {
                    blankRoutes.map(route => (
                      <Route
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                        render={() => (
                          <Route key={route.path} exact path={route.path} component={route.component} />
                        )}
                      />
                    ))
                  }
                    <BasicLayout>
                      <Switch>
                        {
                          headerRoutes.map(route => {
                            return (
                              <Route
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                render={() => (
                                  <Route key={route.path} exact path={route.path} component={route.component} />
                                )}
                              />
                            );
                          })
                        }
                        {
                          redirectUrl !== '' && <Redirect from='/' to={redirectUrl} />
                        }
                      </Switch>
                    </BasicLayout>
                </Switch>
              </BrowserRouter>
            </Suspense>
          )
      }
    </>
  );
};

export default Router;

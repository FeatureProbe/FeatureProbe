import { useEffect, useCallback, useState, Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { headerRoutes, blankRoutes } from './routes';
import { getApplicationSettings } from 'services/application';
import Loading from 'components/Loading';
import { getRedirectUrl } from 'utils/getRedirectUrl';
import BasicLayout from 'layout/BasicLayout';
import { EventTrack } from 'utils/track';
import { IApplicationSetting } from 'interfaces/applicationSetting';

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
    const res = await getApplicationSettings<IApplicationSetting>();

    if (res.success && res.data && res.data.loginMode === 'GUEST') {
      localStorage.setItem('isDemo', 'true');
    } else {
      localStorage.setItem('isDemo', 'false');
    }
    setIsLoading(false);
    initRedirectUrl();
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

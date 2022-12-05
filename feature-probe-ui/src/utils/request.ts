function parseJSON(response: Response) {
  if (response.headers.get('token')) {
    localStorage.setItem('token', response.headers.get('token') || '');
  }
  return response.json();
}

function checkStatus(response: Response) {
  if (
    (response.status >= 200 && response.status < 300) 
    || response.status === 400 
    || response.status === 403
    || response.status === 404
  ) {
    return response;
  } 
  else if (response.status === 401) {
    window.location.href = '/login';
    return response;
  } 
  else {
    const error: Error = new Error(response.statusText);
    throw error;
  }
}

type IResponse<T> = {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
}

function handleCode<T, R>(res: IResponse<T>, resolve: (value: IResponse<R> | PromiseLike<IResponse<R>>) => void) {
  if (res.code) {
    resolve({
      success: false,
      code: res.code,
      message: res.message,
    });
  }
}

export default function request<T>(url: string, options?: RequestInit): Promise<IResponse<T>> {
  options = options || {
    headers:{
      'Accept-Language': 'en-US'
    }
  };

  return new Promise(resolve => {
    return fetch(url, options)
      .then(response => checkStatus(response))
      .then(response => parseJSON(response))
      .then(response => {
        handleCode<IResponse<T>, T>(response, resolve);
        resolve({
          success: true,
          data: response,
        });
      })
      .catch(err => {
        resolve({
          success: false,
          message: err.message,
        });
      });
  });
}

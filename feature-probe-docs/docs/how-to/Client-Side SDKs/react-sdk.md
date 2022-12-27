---
sidebar_position: 5
---

# React SDK

:::tip
To provide a better integration for use in React applications, React SDK builds on JavaScript SDK. Much of the JavaScript SDK functionality is also available for the React SDK to use. Please reference [JavaScript SDK](./javascript-sdk.md).
:::

## Try Out Demo Code

We provide a runnable demo code for you to understand how FeatureProbe SDK is used.

1. Start FeatureProbe Service with docker composer. [How to](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo and run the demo program:


```bash
git clone https://github.com/FeatureProbe/client-sdk-react.git
cd client-sdk-react
```

3. Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-react/tree/main/example),
do some change and run the program again.

The first Demo:
```bash
cd example/provider
npm install
npm run start
```

The second Demo:

```bash
cd example/async-provider
npm install
npm run start
```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a `React` application using `FeatureProbe`.

### Step 1. Use create-react-app to create a new React application:


```js
npx create-react-app react-demo && cd react-demo
```


### Step 2. Install the SDK:

```js
npm install featureprobe-client-sdk-react --save
```

### Step 3. In App.js, import FPProvider:


```jsx
import { FPProvider } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  user.with("userId", /* userId */);
  
  return (
    <FPProvider 
      config={{
        remoteUrl: "https://featureprobe.io/server",
        // remoteUrl: "https://127.0.0.1:4007", // for local docker
        clientSdkKey: /* clientSdkKey */
        user,
      }}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
```


### Step 4. Create a new file home.js in the same directory as App.js, import withFPConsumer in home.js:

```jsx
import { withFPConsumer } from 'featureprobe-client-sdk-client';

const Home = ({ toggles, client }) => {
  const value = client?.boolValue(/* toggleKey */, false);
  return (
    <div>
      <div>You can use toggle value like this: ${value}</div>
      <div>You can also get toggle detail from toggles object like this: ${toggles?.[/* toggleKey */]}</div>
    </div>
  )
};

export default withFPConsumer(Home);
```

## API

### FPProvider
Initializing SDK with `FPProvider`. `FPProvider` accepts a config object, which provides configuration options for the React SDK. Read [Available options](./javascript-sdk#available-options) for more information.

```jsx
import { FPProvider } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  user.with("userId", /* userId */);
  
  return (
    <FPProvider 
      config={{
        remoteUrl: "https://featureprobe.io/server",
        // remoteUrl: "https://127.0.0.1:4007", // for local docker
        clientSdkKey: /* clientSdkKey */
        user,
      }}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
```

Alternatively, you can pass your own client in to the `FPProvider`:

```jsx
import { FPProvider, FeatureProbe } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  user.with("userId", /* userId */);

  const client = new FeatureProbe({
    remoteUrl: "https://featureprobe.io/server",
    // remoteUrl: "https://127.0.0.1:4007", // for local docker
    clientSdkKey: /* clientSdkKey */
    user,
  })
  
  return (
    <FPProvider 
      FPClient={client}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
```

### AsyncFPProvider

`AsyncFPProvider` is an another initialization method. This method will wait until SDK emit `ready` event, this can ensure toggles and the client are ready at the start of your React app lifecycle


```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { AsyncFPProvider, FPUser } from 'featureprobe-client-sdk-react';

(async () => {
  const FPProvider = await AsyncFPProvider({
    remoteUrl: "https://featureprobe.io/server",
    // remoteUrl: "https://127.0.0.1:4007", // for local docker
    clientSdkKey: /* clientSdkKey */
    user,
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <FPProvider>
      <App />
    </FPProvider>
  );
})();
```

### withFPConsumer
After you has initialized the React SDK, use `withFPConsumer` to access toggles values and the `FeatureProbe` client. 


```jsx
import { withFPConsumer } from 'featureprobe-client-sdk-react';

function HocComponent(props) {
  const { toggles, client } = props;
  const value = client.boolValue(/* toggleKey */);

  return (
    <div>
      <div>{JSON.stringify(toggles)}</div>
      <div>{value}</div>
    </div>
  );
}

export default withFPConsumer(HocComponent);
```

The React SDK offers two custom hooks which you can use as an alternative to `withFPConsumer`: `useFPClient` and `useFPToggles`.

### useFPClient
`useFPClient` is a custom hook which returns the `FeatureProbe` client.


```jsx
import { useFPClient } from 'featureprobe-client-sdk-react';

function HookComponent() {
  const client = useFPClient();
  return (
    <div style={{marginTop: '20px'}}>
      <div>Hook</div>
      <samp>{`console.log(JSON.stringify(client.boolDetail('demo_features')))`}</samp>
      <div>{JSON.stringify(client.boolDetail('demo_features'))}</div>
    </div>
  );
}

export default HookComponent;
```

### useFPToggles
`useFPToggles` is a custom hook which returns all feature toggles.

```jsx
import { useFPToggles } from 'featureprobe-client-sdk-react';

function HookComponent() {
  const toggles = useFPToggles();
  return (
    <div>
      <div>{JSON.stringify(toggles)}</div>
    </div>
  );
}

export default HookComponent;
```

## SDK Open API

API Docs: [SDK API](https://featureprobe.github.io/client-sdk-react/)


## Testing

```shell
npm run test
```
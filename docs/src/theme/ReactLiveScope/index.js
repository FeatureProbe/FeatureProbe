import React from 'react';
import { FeatureProbe, FPUser } from 'featureprobe-client-sdk-js';
// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  FeatureProbe,
  FPUser,
};
export default ReactLiveScope;

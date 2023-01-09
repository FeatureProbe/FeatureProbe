import { Styles, FloaterProps } from 'react-joyride';

export const tourStyle: Styles = {
  options: {
    arrowColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#212529',
    zIndex: 1000,
  },
  buttonNext: {
    background: '#556EE6',
    color: '#FFFFFF',
    fontSize: '12px',
    borderRadius: '6px',
    width: '64px'
  },
  buttonBack: {
    background: '#FFFFFF',
    border: '1px solid #556EE6',
    borderRadius: '6px',
    color: '#556EE6',
    fontSize: '12px',
    padding: '7px 8px',
    width: '64px'
  },
  buttonClose: {
    width: '64px'
  },
  tooltip: {
    padding: '16px 24px',
    borderRadius: '12px'
  },
  tooltipContent: {
    padding: '0',
    fontSize: '14px',
    textAlign: 'left'
  },
  tooltipFooter: {
    marginTop: '24px'
  },
  spotlight: {
    borderRadius: '12px',
  },
};

export const floaterStyle: FloaterProps = {
  styles: {
    arrow: {
      spread: 12,
      length: 6,
      color: '#FFFFFF'
    },
  },
};

export const commonConfig = {
  disableBeacon: true,
  showSkipButton: false,
  disableOverlayClose: true,
  hideCloseButton: true,
  hideFooter: false,
  spotlightClicks: false,
};

import { lazy } from 'react';

const Project = lazy(() => import('../pages/project'));
const Toggle = lazy(() => import('../pages/toggle'));
const Targeting = lazy(() => import('../pages/targeting'));
const Member = lazy(() => import('../pages/member'));
const Profile = lazy(() => import('../pages/profile'));
const NotFound = lazy(() => import('../pages/notFound'));
const Login = lazy(() => import('../pages/login'));
const DemoLogin = lazy(() => import('../pages/login/demoLogin'));
const Segment = lazy(() => import('../pages/segment'));
const SegmentEdit = lazy(() => import('../pages/segmentEdit'));
const GetStarted = lazy(() => import('../pages/getStarted'));
const Approvals = lazy(() => import('../pages/approval'));
const ProjectSetting = lazy(() => import('../pages/projectSetting'));
const ApiToken = lazy(() => import('../pages/apiToken'));
const PersonalAPIToken = lazy(() => import('pages/personalToken'));
const WebHook = lazy(() => import('../pages/webhook'));

export const PROJECT_PATH = '/projects';
export const TOGGLE_PATH = '/:projectKey/:environmentKey/toggles';
export const SETTING_PATH = '/:projectKey/:environmentKey/settings';
export const SEGMENT_PATH = '/:projectKey/:environmentKey/segments';
export const SEGMENT_ADD_PATH = '/:projectKey/:environmentKey/segments/new';
export const SEGMENT_EDIT_PATH = '/:projectKey/:environmentKey/segments/:segmentKey/:navigation';
export const TARGETING_PATH = '/:projectKey/:environmentKey/:toggleKey/:navigation';
export const GET_STARTED_PATH = '/:projectKey/:environmentKey/:toggleKey/get-started';
export const MEMBER_PATH = '/settings/members';
export const PROFILE_PATH = '/user/profile';
export const PERSONAL_APITOKEN_PATH = '/user/tokens';
export const WEBHOOK_LIST_PATH = '/settings/webhooks/list';
export const APPROVAL_PATH = '/approvals/:navigation';
export const APITOKEN_PATH = '/settings/tokens';



const isDemo = localStorage.getItem('isDemo') === 'true';

export const headerRoutes = [
  {
    path: PROJECT_PATH,
    exact: true,
    component: Project
  },
  {
    path: SEGMENT_ADD_PATH,
    exact: true,
    component: SegmentEdit
  },
  {
    path: SEGMENT_EDIT_PATH,
    exact: true,
    component: SegmentEdit
  },
  {
    path: SEGMENT_PATH,
    exact: true,
    component: Segment
  },
  {
    path: TOGGLE_PATH,
    exact: true,
    component: Toggle
  },
  {
    path: SETTING_PATH,
    exact: true,
    component: ProjectSetting
  },
  {
    path: GET_STARTED_PATH,
    exact: true,
    component: GetStarted
  },
  {
    path: TARGETING_PATH,
    exact: true,
    component: Targeting
  },
  {
    path: APPROVAL_PATH,
    exact: true,
    component: Approvals
  },
  {
    path: MEMBER_PATH,
    exact: true,
    component: Member
  },
  {
    path: PROFILE_PATH,
    exact: true,
    component: Profile
  },
  {
    path: APITOKEN_PATH,
    exact: true,
    component: ApiToken
  },
  {
    path: APITOKEN_PATH,
    exact: true,
    component: ApiToken
  },
  {
    path: PERSONAL_APITOKEN_PATH,
    exact: true,
    component: PersonalAPIToken
  },
  {
    path: WEBHOOK_LIST_PATH,
    exact: true,
    component: WebHook
  }
];

export const blankRoutes = [
  {
    path: '/notFound',
    exact: true,
    component: NotFound
  },
  {
    path: '/login',
    exact: true,
    component: isDemo? DemoLogin : Login
  }
];

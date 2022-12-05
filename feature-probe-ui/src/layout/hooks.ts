import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { useLocalStorage } from 'utils/hooks';

export const usePutaway = () => {
  const [ isPutAway, setIsputAway ] = useLocalStorage('sidebarIsPutAway', false);

  return { 
    isPutAway, 
    setIsputAway, 
  };
};

export const useUserInfo = () => {
  const [ userInfo, saveUserInfo ] = useState({
    account: '',
    role: '',
  });

  const [ approvalCount, saveApprovalCount ] = useState<number>(0);

  return {
    userInfo,
    approvalCount,
    saveUserInfo,
    saveApprovalCount,
  };
};

export const SidebarContainer = createContainer(usePutaway);
export const HeaderContainer = createContainer(useUserInfo);

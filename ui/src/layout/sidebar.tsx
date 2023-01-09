import { ReactNode } from 'react';
import PutAway from 'components/PutAway';
import { SidebarContainer } from './hooks';

interface IProps {
  children: ReactNode;
}

const Sidebar = (props: IProps) => {
  return (
    <SidebarContainer.Provider>
      <div>
        {props.children}
        <PutAway />
      </div>
    </SidebarContainer.Provider>
	);
};

export default Sidebar;
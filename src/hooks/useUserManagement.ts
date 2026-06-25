import { useRouterState } from '@tanstack/react-router';
import { saveLocalStorage } from '../utils/saveLocalStorage';
import { useEffect, useState } from 'react';
import { getLocalStorage } from '../utils/saveLocalStorage';

export const useUserManagement = () => {
  const routerState = useRouterState();
  const { username, roomID } = routerState.location.state.userState || {};
  const [user, setUser] = useState<string>('');

  useEffect(() => {
    if (username) {
      saveLocalStorage('username', username);
    }
    setUser(getLocalStorage('username') || '');
  }, [username]);


  return {
    user,
    roomID,
  };
};

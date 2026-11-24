import { useEffect, useRef, useState } from 'react';
import { ROBOT_SOCKET_BASE_URL } from '@/domains/Robot/constants/socket';
import {
  connectRobotCommandSocket,
  type CommandConnectionStatus,
} from '@/domains/Robot/remotes/robotCommandSocket';

export function useRobotControl() {
  const controller = useRef<ReturnType<
    typeof connectRobotCommandSocket
  > | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<CommandConnectionStatus>('connecting');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const connection = connectRobotCommandSocket(
      `${ROBOT_SOCKET_BASE_URL}/ws/robot-command`,
      setConnectionStatus,
      setIsSending,
    );
    controller.current = connection;

    function stopWhenHidden() {
      if (document.visibilityState === 'hidden') connection.stop();
    }

    window.addEventListener('blur', connection.stop);
    window.addEventListener('pagehide', connection.stop);
    document.addEventListener('visibilitychange', stopWhenHidden);

    return () => {
      window.removeEventListener('blur', connection.stop);
      window.removeEventListener('pagehide', connection.stop);
      document.removeEventListener('visibilitychange', stopWhenHidden);
      controller.current = null;
      connection.disconnect();
    };
  }, []);

  return {
    connectionStatus,
    isSending,
    start: () => controller.current?.start(),
    stop: () => controller.current?.stop(),
  };
}

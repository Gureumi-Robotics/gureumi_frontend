import { ROBOT_SOCKET_BASE_URL } from '@/domains/Robot/constants/socket';

export type JetsonStatus = 0 | 1;

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting';

const RECONNECT_DELAY_MS = 3 * 1000;

export function connectRobotStatusSocket(
  onStatus: (status: JetsonStatus) => void,
  onConnectionChange: (status: ConnectionStatus) => void,
) {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  function connect() {
    if (disposed) return;

    const currentSocket = new WebSocket(
      `${ROBOT_SOCKET_BASE_URL}/ws/robot-status`,
    );
    socket = currentSocket;

    currentSocket.onopen = () => {
      console.log('[Jetson] 웹소켓 연결 완료');
      onConnectionChange('connected');
    };

    currentSocket.onmessage = (event) => {
      if (typeof event.data !== 'string') {
        console.warn('[Jetson] 텍스트 메시지가 아닙니다.');
        return;
      }

      try {
        const data: unknown = JSON.parse(event.data);

        if (
          typeof data !== 'object' ||
          data === null ||
          !('jetson_status' in data) ||
          (data.jetson_status !== 0 && data.jetson_status !== 1)
        ) {
          console.warn('[Jetson] 올바르지 않은 상태 데이터:', data);
          return;
        }

        console.log('[Jetson] 상태값:', data.jetson_status);
        onStatus(data.jetson_status);
      } catch (error) {
        console.error('[Jetson] JSON 변환 실패:', error);
      }
    };

    currentSocket.onerror = () => {
      console.error('[Jetson] 웹소켓 연결 오류');
    };

    currentSocket.onclose = (event) => {
      console.log('[Jetson] 웹소켓 연결 종료:', event.code);
      if (disposed) return;

      onConnectionChange('reconnecting');
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, RECONNECT_DELAY_MS);
    };
  }

  connect();

  return () => {
    disposed = true;
    if (reconnectTimer !== null) clearTimeout(reconnectTimer);
    if (socket === null) return;

    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
    socket.close();
  };
}

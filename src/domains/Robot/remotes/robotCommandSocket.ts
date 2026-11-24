export type CommandConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting';
export type MotorCommand = { type: 'motor_command'; command: 'forward' | 'stop' };

const FORWARD_COMMAND: MotorCommand = {
  type: 'motor_command',
  command: 'forward',
};
const STOP_COMMAND: MotorCommand = {
  type: 'motor_command',
  command: 'stop',
};
const COMMAND_INTERVAL_MS = 100;
const RECONNECT_DELAY_MS = 3000;

export function connectRobotCommandSocket(
  url: string,
  onConnectionChange: (status: CommandConnectionStatus) => void,
  onMovingChange: (sending: boolean) => void,
) {
  let socket: WebSocket | null = null;
  let commandTimer: ReturnType<typeof setInterval> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let disposed = false;

  function stopSending() {
    if (commandTimer !== null) {
      clearInterval(commandTimer);
      commandTimer = null;
    }
    onMovingChange(false);
  }

  function stop() {
    stopSending();
    if (disposed || socket?.readyState !== WebSocket.OPEN) return;

    try {
      socket.send(JSON.stringify(STOP_COMMAND));
    } catch {
      // 전송에 실패해도 전진 반복 전송은 중단된 상태를 유지합니다.
    }
  }

  function sendForward(): boolean {
    // 밀린 명령을 쌓지 않고 재조작을 기다립니다.
    if (socket?.readyState !== WebSocket.OPEN || socket.bufferedAmount > 0) {
      stopSending();
      return false;
    }
    try {
      socket.send(JSON.stringify(FORWARD_COMMAND));
      return true;
    } catch {
      stopSending();
      return false;
    }
  }

  function start() {
    if (disposed || commandTimer !== null || !sendForward()) return;
    commandTimer = setInterval(sendForward, COMMAND_INTERVAL_MS);
    onMovingChange(true);
  }

  function connect() {
    if (disposed) return;
    const currentSocket = new WebSocket(url);
    socket = currentSocket;

    currentSocket.onopen = () => onConnectionChange('connected');
    currentSocket.onerror = stopSending;
    currentSocket.onclose = () => {
      stopSending();
      if (disposed) return;
      onConnectionChange('reconnecting');
      reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
    };
  }

  connect();

  return {
    start,
    stop,
    disconnect() {
      disposed = true;
      stopSending();
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
      if (socket !== null) {
        socket.onopen = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      }
    },
  };
}

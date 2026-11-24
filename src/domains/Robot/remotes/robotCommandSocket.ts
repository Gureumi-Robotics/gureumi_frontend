export type CommandConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting';
export type MotorCommand = { type: 'motor_command'; command: 'forward' };

const FORWARD_COMMAND: MotorCommand = {
  type: 'motor_command',
  command: 'forward',
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

  function stop() {
    if (commandTimer !== null) {
      clearInterval(commandTimer);
      commandTimer = null;
    }
    onMovingChange(false);
    // 현재 BE는 forward만 받습니다. stop 타입 추가 전에는 전송 중단으로 정지합니다.
  }

  function sendForward(): boolean {
    // 밀린 명령을 쌓지 않고 재조작을 기다립니다.
    if (socket?.readyState !== WebSocket.OPEN || socket.bufferedAmount > 0) {
      stop();
      return false;
    }
    try {
      socket.send(JSON.stringify(FORWARD_COMMAND));
      return true;
    } catch {
      stop();
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
    currentSocket.onerror = stop;
    currentSocket.onclose = () => {
      stop();
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
      stop();
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

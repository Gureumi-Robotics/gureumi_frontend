export type JetsonStatus = 0 | 1

export function connectRobotStatusSocket(onStatus: (status: JetsonStatus) => void) {
  const socket = new WebSocket('ws://43.201.10.151/ws/robot-status')

  socket.onopen = () => {
    console.log('[Jetson] 웹소켓 연결 완료')
  }

  socket.onmessage = (event) => {
    if (typeof event.data !== 'string') {
      console.warn('[Jetson] 텍스트 메시지가 아닙니다.')
      return
    }

    try {
      const data: unknown = JSON.parse(event.data)

      if (
        typeof data !== 'object' ||
        data === null ||
        !('jetson_status' in data) ||
        (data.jetson_status !== 0 && data.jetson_status !== 1)
      ) {
        console.warn('[Jetson] 올바르지 않은 상태 데이터:', data)
        return
      }

      console.log('[Jetson] 상태값:', data.jetson_status)
      onStatus(data.jetson_status)
    } catch (error) {
      console.error('[Jetson] JSON 변환 실패:', error)
    }
  }

  socket.onerror = () => {
    console.error('[Jetson] 웹소켓 연결 오류')
  }

  socket.onclose = (event) => {
    console.log('[Jetson] 웹소켓 연결 종료:', event.code)
  }

  return () => {
    socket.onopen = null
    socket.onmessage = null
    socket.onerror = null
    socket.onclose = null
    socket.close()
  }
}

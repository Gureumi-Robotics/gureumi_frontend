import { AppProviders } from '@/providers/AppProviders'
import { useEffect, useState } from 'react'
import type { ConnectionStatus, JetsonStatus } from '@/domains/Robot/remotes/robotStatusSocket'
import { connectRobotStatusSocket } from '@/domains/Robot/remotes/robotStatusSocket'
import styled from '@emotion/styled'

export function App() {
  const [jetsonStatus, setJetsonStatus] = useState<JetsonStatus | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    const disconnect = connectRobotStatusSocket(setJetsonStatus, (status) => {
      setConnectionStatus(status)
      if (status !== 'connected') setJetsonStatus(null)
    })

    return disconnect
  }, [])

  const connectionLabels: Record<ConnectionStatus, string> = {
    connecting: '연결 중',
    connected: '연결됨',
    reconnecting: '연결 끊김 - 3초 간격으로 재연결 시도 중',
  }
  const connectionText = connectionLabels[connectionStatus]

  let jetsonText = '상태 확인 불가'

  if (connectionStatus === 'connected') {
    if (jetsonStatus === null) {
      jetsonText = '확인 중'
    } else if (jetsonStatus === 1) {
      jetsonText = '수신'
    } else {
      jetsonText = '미수신'
    }
  }

  return (
    <AppProviders>
      <Title>Gureumi</Title>
      <StatusText role='status'>서버 연결: {connectionText}</StatusText>
      <StatusText role='status'>Jetson 신호: {jetsonText}</StatusText>
    </AppProviders>
  )
}

const Title = styled.h1`
  margin: 0;
  padding: 24px;
`

const StatusText = styled.p`
  margin: 0;
  padding: 24px;
  font-size: 18px;
`

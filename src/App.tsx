import { AppProviders } from '@/providers/AppProviders'
import { useEffect, useState } from 'react'
import type { JetsonStatus } from '@/domains/Robot/remotes/robotStatusSocket'
import { connectRobotStatusSocket } from '@/domains/Robot/remotes/robotStatusSocket'
import styled from '@emotion/styled'

export function App() {
  const [jetsonStatus, setJetsonStatus] = useState<JetsonStatus | null>(null)

  useEffect(() => {
    const disconnect = connectRobotStatusSocket(setJetsonStatus)

    return disconnect
  }, [])

  return (
    <AppProviders>
      <Title>Gureumi</Title>
      <StatusText role='status'>
        Jetson 신호: {jetsonStatus === null ? '확인 중' : jetsonStatus === 1 ? '수신' : '미수신'}
      </StatusText>
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

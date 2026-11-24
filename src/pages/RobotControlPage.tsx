import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { RemoteControl } from '@/domains/Robot/components/RemoteControl';
import {
  connectRobotStatusSocket,
  type ConnectionStatus,
  type JetsonStatus,
} from '@/domains/Robot/remotes/robotStatusSocket';

const connectionLabels: Record<ConnectionStatus, string> = {
  connecting: '연결 중',
  connected: '연결됨',
  reconnecting: '연결 끊김 - 3초 간격으로 재연결 시도 중',
};

export function RobotControlPage() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting');
  const [jetsonStatus, setJetsonStatus] = useState<JetsonStatus | null>(null);

  useEffect(
    () =>
      connectRobotStatusSocket(setJetsonStatus, (status) => {
        setConnectionStatus(status);
        if (status !== 'connected') setJetsonStatus(null);
      }),
    [],
  );

  let signalText = '상태 확인 불가';
  if (connectionStatus === 'connected') {
    signalText =
      jetsonStatus === null
        ? '확인 중'
        : jetsonStatus === 1
          ? '수신'
          : '미수신';
  }

  return (
    <Screen>
      <Panel>
        <Title>호기 관제</Title>
        <div role="status">
          <StatusText>
            서버 연결: {connectionLabels[connectionStatus]}
          </StatusText>
          <StatusText>Jetson 신호: {signalText}</StatusText>
        </div>
        <RemoteControl />
      </Panel>
    </Screen>
  );
}

const Screen = styled.main`
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 28px;
  border: 1px solid #e0e4e9;
  border-radius: 12px;
  background: white;

  @media (max-width: 360px) {
    padding: 16px;
  }
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 22px;
`;

const StatusText = styled.p`
  margin: 16px 0;
  line-height: 1.6;
`;

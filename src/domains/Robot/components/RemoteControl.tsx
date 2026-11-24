import styled from '@emotion/styled';
import { useRobotControl } from '@/domains/Robot/hooks/useRobotControl';

type Control = {
  id: string;
  label: string;
  disabled: boolean;
  onClick?: () => void;
};

export function RemoteControl() {
  const { connectionStatus, isSending, start, stop } = useRobotControl();

  // 현재는 전진, 중지 기능만 활성화
  const controls: Control[] = [
    { id: 'forward-left', label: '전진 좌회전', disabled: true },
    {
      id: 'forward',
      label: '전진',
      disabled: connectionStatus !== 'connected',
      onClick: start,
    },
    { id: 'forward-right', label: '전진 우회전', disabled: true },
    { id: 'empty-left', label: '-', disabled: true },
    { id: 'stop', label: '정지', disabled: false, onClick: stop },
    { id: 'empty-right', label: '-', disabled: true },
    { id: 'backward-left', label: '후진 좌회전', disabled: true },
    { id: 'backward', label: '후진', disabled: true },
    { id: 'backward-right', label: '후진 우회전', disabled: true },
  ];

  return (
    <>
      <StatusText role="status">
        {isSending ? '전진 명령 전송 중' : '명령 전송 중지'}
      </StatusText>
      <Grid role="group" aria-label="로봇 원격 조작">
        {controls.map((control) => (
          <ControlButton
            key={control.id}
            type="button"
            disabled={control.disabled}
            onClick={control.onClick}
            aria-pressed={control.id === 'forward' ? isSending : undefined}
            $isStop={control.id === 'stop'}
          >
            <span>{control.label}</span>
          </ControlButton>
        ))}
      </Grid>
    </>
  );
}

const StatusText = styled.p`
  margin: 0 0 16px;
  font-size: 14px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const ControlButton = styled.button<{ $isStop: boolean }>`
  aspect-ratio: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 1px solid #aeb7c2;
  border-radius: 3px;
  background: ${({ $isStop }) => ($isStop ? '#e0e4e9' : '#fff')};
  color: #242f3c;
  font-size: clamp(10px, 3vw, 13px);
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    border-color: #d7dde4;
    background: #eceff2;
    color: #a1aab5;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background: ${({ $isStop }) => ($isStop ? '#d2d8df' : '#f0f3f6')};
  }

  &:active:enabled {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid #4265b0;
    outline-offset: 3px;
  }
`;

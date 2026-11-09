# gureumi_frontend

React + Vite + TypeScript / Emotion / TanStack Query + Zustand

## 시작하기

```bash
npm install
cp .env.example .env
npm run dev
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 체크 + 프로덕션 빌드 |
| `npm run typecheck` | 타입 체크만 |
| `npm run lint` | ESLint |

## 폴더 구조

```
src/
├─ components/   # 전체 프로젝트에서 쓰는 공통 컴포넌트
├─ hooks/        # 전체 프로젝트에서 쓰는 공통 Hook
├─ providers/    # QueryClientProvider 등 앱 전역 Provider
├─ styles/       # Emotion 전역 스타일
└─ domains/      # 도메인별 코드
   └─ <Domain>/  # 해당 도메인에서만 쓰는 코드
      ├─ components/
      ├─ hooks/      # React Query 훅
      ├─ remotes/    # 도메인 API 함수
      └─ stores/     # Zustand store
```

- 경로 alias: `@/` → `src/`
- 특정 도메인에서만 쓰는 코드는 `domains/<Domain>/` 아래에 함께 둔다. 기능을 지울 때 폴더 하나를 지우면 끝나야 한다.
- 도메인 폴더 안의 하위 폴더(`containers`, `constants`, `utils` 등)는 코드가 생길 때 만든다.
- 다른 도메인 폴더를 깊은 상대 경로로 import하지 않는다.
- 서버 상태는 TanStack Query, 클라이언트 상태는 Zustand로 관리한다. Zustand store는 책임 단위로 나눈다.

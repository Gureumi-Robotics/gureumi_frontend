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
├─ app/        # 앱 진입점, Provider 조합
├─ domains/    # 도메인별 코드 (components, hooks, api, stores를 도메인 폴더 안에 함께 둠)
└─ shared/     # 여러 도메인이 함께 쓰는 코드 (components, hooks, lib, styles)
```

- 경로 alias: `@/` → `src/`
- 특정 도메인에서만 쓰는 코드는 `domains/<Domain>/` 아래에 둔다.
- 서버 상태는 TanStack Query, 클라이언트 상태는 Zustand로 관리한다.

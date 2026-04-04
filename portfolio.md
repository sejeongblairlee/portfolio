# 프로젝트: Spatial Interactive Portfolio (Project: world/portfolio)

## 1. 디자인 컨셉 & 비주얼 스토리 (Visual Narrative)
- **배경**: 서울 북촌의 고요한 거리. 푸른 하늘 아래 세로로 긴 현대적인 흰색 타일 건물과 주변의 오래된 나무들.
- **인트로 여정**: 
  1. (Default) 건물 외관 및 주변 풍경 (북촌의 세련된 감각).
  2. (Scroll 1) 건물 내부로 진입. 자작나무 책상 위에 놓인 **MacBook Pro 5세대 (Space Gray)**와 **iPod Nano 4th Gen (Silver)** 발견.
  3. (Scroll 2) 닫혀 있던 맥북이 부드럽게 열리며, 브라우저 전체가 최신 **macOS 화면**으로 가득 참.
- **분위기**: 서울의 도시 백색소음 + 잔잔한 새소리 (ASMR). 따뜻하면서도 정갈한 화이트 미니멀리즘.

## 2. 기술 스펙 (Technical Specification)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS (글래스모피즘 효과 적용 필수)
- **Typography**: **Pretendard** (전체 적용)
- **Animation**: Framer Motion (스크롤 기반 시퀀스 애니메이션)
- **Asset**: 고해상도 이미지는 WebP 포맷으로 최적화하여 로딩 속도 극대화.

## 3. 기능 요구사항 (Functional Requirements)

### A. macOS Interface
- **버전**: 최신 macOS (Sonoma/Ventura 스타일) 반영.
- **인터랙션**: 창 열기/닫기/최소화 버튼이 실제 macOS처럼 부드럽게 작동해야 함.
- **구조**: 바탕화면에 **'blair'**라는 폴더 하나가 기본으로 배치됨.
- **확장성**: 추후 'blair' 폴더 내에 다수의 하위 폴더와 프로젝트 파일을 추가할 수 있는 클라우드 구조(File System) 고려.

### B. iPod Nano 4th Gen (Silver)
- **음악**: 저작권 없는(Lofi/Ambient) 무료 음원 소스 연동 추천 (예: Pixabay Music API 또는 로컬 무료 음원).
- **UI**: 4세대 특유의 실버 메탈 질감과 클릭 휠 인터랙션 구현.

## 4. 구현 가이드 (Claude를 위한 지시사항)
- **Performance**: 로딩 지연을 최소화하기 위해 인터랙티브 요소는 단계별로 로드할 것.
- **Glassmorphism**: macOS 윈도우와 Dock 바에 `backdrop-blur` 효과를 적극 활용하여 최신 OS의 투명도 구현.
- **Sound**: 사용자의 첫 클릭 시 오디오 컨텍스트가 활성화되며 북촌의 백색소음이 자연스럽게 시작되도록 설계.

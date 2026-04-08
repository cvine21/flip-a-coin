# Flip a coin - Telegram Mini App

Одноэкранное приложение для Telegram Mini Apps на `React + Vite + TypeScript` с plain CSS/PostCSS. Экран показывает графическую монету (asset image), умеет безопасно переключаться в CSS fallback-режим при ошибке загрузки asset, запускает локальный звук подброса и завершает сценарий даже при ошибках audio-среды.

## Реализованное поведение

- Запуск подброса двумя триггерами: кнопка `Flip a coin` и тап по монете.
- Внутренний доменный результат только `HEADS`/`TAILS`; UI отображает `Heads`/`Tails`.
- Результат (`plannedResult`) фиксируется в момент старта и не меняется в рамках одного запуска.
- Параллельный старт заблокирован до завершения анимации.
- Графический режим монеты используется по умолчанию, fallback-режим включается при проблемах с image asset.
- Локальный audio проигрывается при старте и останавливается после завершения анимации; ошибки audio логируются, но не прерывают сценарий.
- В Telegram runtime вызывается `WebApp.ready()` один раз после монтирования UI.
- В preview без Telegram bridge применяется fallback-тема и сохраняется интерактивность экрана.

## Требования

- Node.js LTS
- npm

## Установка и запуск

```bash
npm ci
npm run dev
```

Preview собранной версии:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

## Quality gates (release)

Перед релизом должны проходить:

```bash
npm run build
npm run test:unit
npm run test:integration
npm run test:e2e:preview
npm run test:fairness
```

Дополнительные составные команды:

- `npm run test:regression` — unit + integration + e2e preview
- `npm run test:smoke` — regression + fairness
- `npm run test:ci` — build + regression

## Ограничения preview-режима

- В браузерном preview `window.Telegram.WebApp` может отсутствовать.
- Тема берётся из fallback (или частично из fallback при неполных `themeParams`).
- Проверка реального Telegram жизненного цикла, встроенного WebView и финального UX обязательна внутри Telegram.

## Деплой на Vercel

Ключевые требования в `vercel.json`:

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- SPA rewrite: `/(.*) -> /index.html`
- Заголовки безопасности: CSP, `Referrer-Policy`, `X-Content-Type-Options`
- CSP учитывает доставку локальных image/audio asset и Telegram embedding (`img-src`, `media-src`, `connect-src`, `frame-src`, `frame-ancestors`)

## Ручной smoke checklist (Telegram iOS + Android)

### 1) Инициализация и тема

- [ ] Экран открывается без ошибок в Telegram WebView.
- [ ] В light и dark режиме цвета соответствуют `themeParams`.
- [ ] При неполных `themeParams` недостающие переменные берутся из fallback.
- [ ] `WebApp.ready()` не ломает сценарий и не приводит к повторной инициализации.

### 2) Графическая монета и fallback

- [ ] В нормальном сценарии виден graphic-режим монеты.
- [ ] При недоступности image asset экран переключается в fallback-режим без потери управления.
- [ ] После переключения в fallback кнопка и монета остаются интерактивными.

### 3) Подброс и lock-state

- [ ] Запуск с кнопки и с тапа по монете работает одинаково.
- [ ] Пока идёт анимация, повторный запуск блокируется.
- [ ] После завершения показывается корректная итоговая сторона (`Heads` или `Tails`).
- [ ] После завершения запуск доступен повторно.

### 4) Audio degradation

- [ ] Локальный звук запускается вместе с подбросом в поддерживаемой среде.
- [ ] Ошибка preload/play не ломает сценарий подброса.
- [ ] После завершения анимации звук не продолжает проигрываться.

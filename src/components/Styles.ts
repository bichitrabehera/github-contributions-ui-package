export const STYLES = `
  /* ===== Layout & Positioning ===== */
  .gcu .relative { position: relative; }
  .gcu .absolute { position: absolute; }
  .gcu .fixed { position: fixed; }
  .gcu .z-50 { z-index: 50; }
  .gcu .pointer-events-none { pointer-events: none; }

  /* ===== Display & Flexbox ===== */
  .gcu .flex { display: flex; }
  .gcu .flex-col { flex-direction: column; }
  .gcu .flex-wrap { flex-wrap: wrap; }
  .gcu .items-center { align-items: center; }
  .gcu .items-baseline { align-items: baseline; }
  .gcu .justify-start { justify-content: flex-start; }
  .gcu .justify-center { justify-content: center; }
  .gcu .inline-block { display: inline-block; }

  /* ===== Width ===== */
  .gcu .w-full { width: 100%; }
  .gcu .w-2\\.5 { width: 0.625rem; }
  .gcu .w-3 { width: 0.75rem; }
  .gcu .w-\\[10px\\] { width: 10px; }
  .gcu .w-\\[13px\\] { width: 13px; }
  .gcu .w-20 { width: 5rem; }

  /* ===== Height ===== */
  .gcu .h-2\\.5 { height: 0.625rem; }
  .gcu .h-3 { height: 0.75rem; }
  .gcu .h-6 { height: 1.5rem; }
  .gcu .h-\\[10px\\] { height: 10px; }
  .gcu .h-\\[13px\\] { height: 13px; }
  .gcu .h-\\[18px\\] { height: 18px; }

  /* ===== Transforms ===== */
  .gcu .-translate-x-1\\/2 { transform: translateX(-50%); }
  .gcu .-translate-y-full { transform: translateY(-100%); }

  /* ===== Gaps & Spacing ===== */
  .gcu .gap-1 { gap: 0.25rem; }
  .gcu .gap-1\\.5 { gap: 0.375rem; }
  .gcu .gap-2 { gap: 0.5rem; }
  .gcu .gap-3 { gap: 0.75rem; }
  .gcu .gap-8 { gap: 2rem; }
  .gcu .gap-x-2 { column-gap: 0.5rem; }
  .gcu .gap-x-3 { column-gap: 0.75rem; }
  .gcu .gap-x-8 { column-gap: 2rem; }
  .gcu .gap-y-2 { row-gap: 0.5rem; }

  /* ===== Margin ===== */
  .gcu .mb-1 { margin-bottom: 0.25rem; }
  .gcu .mb-3 { margin-bottom: 0.75rem; }
  .gcu .mb-4 { margin-bottom: 1rem; }
  .gcu .mb-6 { margin-bottom: 1.5rem; }
  .gcu .mt-3 { margin-top: 0.75rem; }
  .gcu .mt-4 { margin-top: 1rem; }
  .gcu .mt-5 { margin-top: 1.25rem; }
  .gcu .mr-1 { margin-right: 0.25rem; }
  .gcu .mr-2 { margin-right: 0.5rem; }
  .gcu .ml-1 { margin-left: 0.25rem; }
  .gcu .-mx-5 { margin-left: -1.25rem; margin-right: -1.25rem; }
  .gcu .-my-5 { margin-top: -1.25rem; margin-bottom: -1.25rem; }

  /* ===== Padding ===== */
  .gcu .p-4 { padding: 1rem; }
  .gcu .p-5 { padding: 1.25rem; }
  .gcu .pt-3 { padding-top: 0.75rem; }
  .gcu .pt-5 { padding-top: 1.25rem; }
  .gcu .pt-px { padding-top: 1px; }
  .gcu .pb-1 { padding-bottom: 0.25rem; }
  .gcu .pr-1\\.5 { padding-right: 0.375rem; }
  .gcu .pr-2 { padding-right: 0.5rem; }
  .gcu .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
  .gcu .py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
  .gcu .py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
  .gcu .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }

  /* ===== Border Radius ===== */
  .gcu .rounded { border-radius: 0.25rem; }
  .gcu .rounded-sm { border-radius: 0.125rem; }
  .gcu .rounded-\\[2px\\] { border-radius: 2px; }
  .gcu .rounded-\\[3px\\] { border-radius: 3px; }
  .gcu .rounded-md { border-radius: 0.375rem; }
  .gcu .rounded-lg { border-radius: 0.5rem; }
  .gcu .rounded-xl { border-radius: 0.75rem; }

  /* ===== Text ===== */
  .gcu .text-right { text-align: right; }
  .gcu .text-\\[10px\\] { font-size: 10px; }
  .gcu .text-\\[11px\\] { font-size: 11px; }
  .gcu .text-xs { font-size: 0.75rem; }
  .gcu .text-sm { font-size: 0.875rem; }
  .gcu .text-2xl { font-size: 1.5rem; }
  .gcu .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  .gcu .font-medium { font-weight: 500; }
  .gcu .font-semibold { font-weight: 600; }
  .gcu .font-bold { font-weight: 700; }
  .gcu .select-none { -webkit-user-select: none; -ms-user-select: none; user-select: none; }
  .gcu .whitespace-nowrap { white-space: nowrap; }
  .gcu .uppercase { text-transform: uppercase; }
  .gcu .tracking-wide { letter-spacing: 0.05em; }

  /* ===== Overflow ===== */
  .gcu .overflow-x-auto { overflow-x: auto; }

  /* ===== Borders ===== */
  .gcu .border { border-width: 1px; border-style: solid; border-color: #404040; }
  .gcu .border-t { border-top-width: 1px; border-top-style: solid; border-top-color: #404040; }
  .gcu .border-neutral-800 { border-color: #262626; }
  .gcu .border-neutral-800\\/60 { border-color: rgba(38, 38, 38, 0.6); }
  .gcu .border-neutral-800\\/40 { border-color: rgba(38, 38, 38, 0.4); }

  /* ===== Transitions & Animations ===== */
  .gcu .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
  .gcu .transition-transform { transition-property: transform; transition-timing-function: ease; transition-duration: 100ms; }
  .gcu .duration-200 { transition-duration: 200ms; }

  @keyframes gcu-pulse {
    50% { opacity: 0.5; }
  }
  .gcu .animate-pulse { animation: gcu-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

  /* ===== Hover States ===== */
  .gcu .hover\\:scale-125:hover { transform: scale(1.25); }
  .gcu .hover\\:scale-150:hover { transform: scale(1.5); }
  .gcu .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
  .gcu .cursor-pointer { cursor: pointer; }

  /* ===== Color Palette ===== */
  /* Neutral Colors */
  .gcu .text-neutral-50 { color: #fafafa; }
  .gcu .text-neutral-100 { color: #f5f5f5; }
  .gcu .text-neutral-200 { color: #e5e7eb; }
  .gcu .text-neutral-300 { color: #d4d4d8; }
  .gcu .text-neutral-400 { color: #9ca3af; }
  .gcu .text-neutral-500 { color: #6b7280; }
  .gcu .text-neutral-600 { color: #4b5563; }

  /* Background Colors */
  .gcu .bg-neutral-700 { background-color: #3f3f46; }
  .gcu .bg-neutral-800 { background-color: #27272a; }
  .gcu .bg-neutral-900 { background-color: #171717; }
  .gcu .bg-neutral-950 { background-color: #0a0a0a; }
  .gcu .text-white { color: #ffffff; }

  /* ===== Background Gradients ===== */
  .gcu .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
  .gcu .from-neutral-900 { --tw-gradient-from: #171717; --tw-gradient-to: rgba(23, 23, 23, 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
  .gcu .via-neutral-950 { --tw-gradient-to: rgba(10, 10, 10, 0); --tw-gradient-stops: var(--tw-gradient-from), #0a0a0a, var(--tw-gradient-to); }
  .gcu .to-neutral-950 { --tw-gradient-to: #0a0a0a; }

  /* ===== Backdrop & Shadow ===== */
  .gcu .backdrop-blur-sm { -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .gcu .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
  .gcu .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

  /* ===== Flex Gap Utilities ===== */
  .gcu .flex-shrink-0 { flex-shrink: 0; }

  /* ===== Utility Overrides ===== */
  .gcu * { box-sizing: border-box; }
`;
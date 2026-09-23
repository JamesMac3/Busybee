// One consistent line-icon set: 24px grid, 1.75 stroke, round caps/joins.
const paths = {
  mower: (
    <>
      <path d="M13.5 11 19 4.5" />
      <path d="M17.5 3.5 20.5 5.5" />
      <path d="M4.5 11h9.5a1.5 1.5 0 0 1 1.5 1.5V15H3v-2.5A1.5 1.5 0 0 1 4.5 11Z" />
      <circle cx="6" cy="17.5" r="2" />
      <circle cx="13" cy="17.5" r="2" />
      <path d="M17 20.5h4.5M2 20.5h1" />
    </>
  ),
  edging: (
    <>
      <path d="M19.5 3.5 9 15" />
      <path d="M17 3l4 3" />
      <circle cx="7.5" cy="17" r="2.5" />
      <path d="M3 21.5V19M5.5 21.5v-1.5M12 21.5v-4M15 21.5v-6M18 21.5v-4.5M21 21.5v-3" />
    </>
  ),
  mulch: (
    <>
      <path d="M2.5 20c1.8-3.6 5.3-5 9.5-5s7.7 1.4 9.5 5Z" />
      <path d="M12 15V8.5" />
      <path d="M12 10.5c0-2.8 2-4.5 5-4.5 0 3-2 4.5-5 4.5Z" />
      <path d="M12 12c0-2.4-1.7-3.8-4.2-3.8 0 2.5 1.7 3.8 4.2 3.8Z" />
    </>
  ),
  design: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3 15.5c3.5 0 5.5-3.5 9-3.5s5 2.5 9 2.5" strokeDasharray="0.1 3" />
      <circle cx="8" cy="8" r="2.2" />
      <circle cx="16" cy="7.5" r="1.5" />
      <path d="M14 18.5h4" />
    </>
  ),
  leaf: (
    <>
      <path d="M4.5 19.5C4.5 10.5 10.5 4.8 20 4c-.8 9.5-6.5 15.5-15.5 15.5Z" />
      <path d="M4.5 19.5 14 10" />
      <path d="M9 15h3.5M11.5 12.5V9.5" />
    </>
  ),
  shears: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M7.8 16.2 16 3.5" />
      <path d="M16.2 16.2 8 3.5" />
      <circle cx="12" cy="10" r=".6" fill="currentColor" />
    </>
  ),
  phone: (
    <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  grass: (
    <>
      <path d="M3 20.5h18" />
      <path d="M5 20.5c0-4 -1-7-2.5-9 2.6 1.2 4 4.3 4 9" />
      <path d="M9.5 20.5c0-5.5-.6-9.5-2-13 2.8 2.4 4 7 4 13" />
      <path d="M13.5 20.5c0-6 1-10.5 3-14-1 4 -1 9-.8 14" />
      <path d="M18 20.5c0-3.5.8-6.5 3-8.5-1.2 2.6-1.4 5.4-1.2 8.5" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 3.9" />
      <path d="M12 17.2v.1" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3.5" width="11" height="17" rx="1.5" />
      <path d="M15 9.5h4a1 1 0 0 1 1 1v10H15" />
      <path d="M7.5 7.5h1M11 7.5h1M7.5 11h1M11 11h1M7.5 14.5h1M11 14.5h1M9 20.5v-2.5h1v2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" />
      <path d="m14 7 3 3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20c.9-3.7 3.9-5.8 7.5-5.8s6.6 2.1 7.5 5.8" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.2" />
    </>
  ),
};

export default function Icon({ name, size = 24, className = '', title }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  );
}

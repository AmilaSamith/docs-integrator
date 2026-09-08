/**
 * One icon per top-level sidebar category, for the collapsed icon rail
 * (see index.tsx). Sidebar categories are auto-generated from the docs
 * folder structure, so there's no icon field to read from data -- this is
 * a hand-picked lookup by label, matching the categories that exist today.
 * `RailFallbackIcon` covers any future/renamed category so the rail never
 * renders a blank slot.
 */
import type { ReactNode } from 'react';

const iconProps = {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function PlatformOverviewIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </svg>
  );
}

function GetStartedIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10 8.5 6 3.5-6 3.5Z" />
    </svg>
  );
}

function EditorIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DevelopIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </svg>
  );
}

function TestIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
    </svg>
  );
}

function DeployIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M12 3v11M8 7l4-4 4 4" />
      <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

function OperateIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="M12 14l4-5" />
      <path d="M4 14h1M19 14h1M12 14v1" />
    </svg>
  );
}

function CustomizeIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2.3" />
      <circle cx="8" cy="17" r="2.3" />
    </svg>
  );
}

function MigrateIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="m4 8 4-4 4 4M8 4v11" />
      <path d="m20 16-4 4-4-4M16 20V9" />
    </svg>
  );
}

function IntegrationControlPlaneIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M4 17V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8" />
      <path d="M8 17v3M16 17v3" />
    </svg>
  );
}

function GuidesIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ReferenceIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <path d="M5 5h6a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2.5H5Z" />
      <path d="M19 5h-2a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2.5H19Z" />
    </svg>
  );
}

function FallbackIcon(): ReactNode {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

const ICONS_BY_LABEL: Record<string, () => ReactNode> = {
  'platform overview': PlatformOverviewIcon,
  'get started': GetStartedIcon,
  editor: EditorIcon,
  develop: DevelopIcon,
  test: TestIcon,
  deploy: DeployIcon,
  operate: OperateIcon,
  customize: CustomizeIcon,
  migrate: MigrateIcon,
  'integration control plane': IntegrationControlPlaneIcon,
  guides: GuidesIcon,
  reference: ReferenceIcon,
};

export function railIconFor(label: string): ReactNode {
  const Icon = ICONS_BY_LABEL[label.trim().toLowerCase()] ?? FallbackIcon;
  return <Icon />;
}

import MDXComponents from '@theme-original/MDXComponents';
import PaletteIcon from '@site/src/components/PaletteIcon';
import { PaletteGrid, PaletteCard, PaletteChip } from '@site/src/components/PaletteCard';
import ArtifactPicker from '@site/src/components/ArtifactPicker';
import GuidesCatalog from '@site/src/components/GuidesCatalog';
import IconGallery from '@site/src/components/IconGallery';
import CloudDocsLink from '@site/src/components/CloudDocsLink';
import { SearchBarPreview } from '@site/src/components/SearchBar';
import { SwatchGrid, ColorSwatch, LogoSwatch } from '@site/src/components/ColorSwatch';
import QuickstartHeader from '@site/src/components/QuickstartHeader';
import Steps from '@site/src/components/Steps';
import Prerequisites, { PrereqCard } from '@site/src/components/Prerequisites';
import ConnectorHeader from '@site/src/components/ConnectorHeader';

export default {
  ...MDXComponents,
  PaletteIcon,
  PaletteGrid,
  PaletteCard,
  PaletteChip,
  ArtifactPicker,
  GuidesCatalog,
  CloudDocsLink,
  IconGallery,
  SearchBarPreview,
  SwatchGrid,
  ColorSwatch,
  LogoSwatch,
  QuickstartHeader,
  Steps,
  Prerequisites,
  PrereqCard,
  // Connectors-only -- not present on wso2-integrator (ConnectorHeader
  // lives in this branch's own src/components, same as ConnectorCatalog
  // itself), so this one registration doesn't round-trip back there.
  ConnectorHeader,
};

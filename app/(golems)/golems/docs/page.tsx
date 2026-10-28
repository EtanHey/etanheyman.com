import { permanentRedirect } from 'next/navigation';

export default function DocsIndex() {
  permanentRedirect('/golems/docs/getting-started');
}

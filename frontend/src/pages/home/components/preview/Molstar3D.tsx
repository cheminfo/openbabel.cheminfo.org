import { PluginContext } from 'molstar/lib/mol-plugin/context.js';
import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec.js';
import { useEffect, useRef, useState } from 'react';

import type { MolstarFormat } from './previewFormats.ts';

export interface Molstar3DProps {
  /** Structure data to display. */
  data: string;
  /** mol* trajectory format of `data`. */
  format: MolstarFormat;
}

/**
 * 3D structure viewer backed by mol*. This component is heavy and must only be
 * imported lazily so mol* stays out of the main bundle.
 * @returns The 3D viewer component.
 */
export default function Molstar3D(props: Molstar3DProps) {
  const { data, format } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pluginRef = useRef<PluginContext | null>(null);
  const [webglError] = useState(() =>
    hasWebGL()
      ? null
      : '3D preview requires WebGL, which is not available here.',
  );
  const [error, setError] = useState<string | null>(null);

  // Lazily create the mol* viewer on the first run, then (re)load the structure
  // whenever the data or format changes.
  useEffect(() => {
    if (webglError) return;
    let cancelled = false;
    async function render() {
      let plugin = pluginRef.current;
      if (!plugin) {
        plugin = new PluginContext(DefaultPluginSpec());
        await plugin.init();
        if (cancelled || !canvasRef.current || !containerRef.current) {
          plugin.dispose();
          return;
        }
        await plugin.initViewerAsync(canvasRef.current, containerRef.current);
        if (cancelled) {
          plugin.dispose();
          return;
        }
        pluginRef.current = plugin;
      }
      await loadStructure(plugin, data, format, () => cancelled);
    }
    render().catch((renderError: unknown) => setError(String(renderError)));
    return () => {
      cancelled = true;
    };
  }, [data, format, webglError]);

  // Dispose the viewer when the component unmounts.
  useEffect(
    () => () => {
      pluginRef.current?.dispose();
      pluginRef.current = null;
    },
    [],
  );

  return (
    <div className="molstar-container" ref={containerRef}>
      <canvas className="molstar-canvas" ref={canvasRef} />
      {(webglError ?? error) && (
        <div className="molstar-error text-selectable">
          {webglError ?? error}
        </div>
      )}
    </div>
  );
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

async function loadStructure(
  plugin: PluginContext,
  data: string,
  format: MolstarFormat,
  isCancelled: () => boolean,
): Promise<void> {
  await plugin.clear();
  const parsed = await plugin.builders.data.rawData({ data });
  if (isCancelled()) return;
  const trajectory = await plugin.builders.structure.parseTrajectory(
    parsed,
    format,
  );
  if (isCancelled()) return;
  await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default');
  plugin.handleResize();
}

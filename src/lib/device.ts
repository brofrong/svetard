export type SilkEnv = {
  reducedMotion: boolean;
  webgl: boolean;
  coarsePointer: boolean;
  cores: number;
};

export function shouldRenderSilk(env: SilkEnv): boolean {
  if (env.reducedMotion || !env.webgl) return false;
  if (env.coarsePointer && env.cores <= 4) return false;
  return true;
}

export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function readSilkEnv(): SilkEnv {
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
    webgl: canUseWebGL(),
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    cores: navigator.hardwareConcurrency ?? 4,
  };
}

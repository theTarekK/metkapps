import { useEffect, useRef } from "react";

/**
 * AnimatedBackdrop — "Iridescent Metaballs" (production)
 *
 * A GPU fragment-shader field of smooth signed-distance metaballs (polynomial
 * smin union) drifting slowly over a near-black base. Each blob is tinted with
 * a vivid, brand-anchored iridescent gradient and softly bloomed with additive
 * glow. The eased cursor is an extra attractor metaball the blobs lean toward,
 * trailing a luminous halo + warm core; layers parallax gently with the pointer.
 *
 * Domain-warped FBM gives organic, non-tiling motion; a vivid iq-style cosine
 * palette (grafted + retuned from the other concepts) keeps colors saturated and
 * on-brand without muddy gray-browns. Per-pixel dithering kills banding on dark
 * tones.
 *
 * Integration contract: WebGL2 preferred, WebGL1 fallback, 2D static fallback,
 * DPR capped at 2, resize handling, prefers-reduced-motion single frame,
 * visibility pause/resume with a delta-time accumulator, runtime context-loss
 * recovery, eased self-tracked pointer (canvas-relative, prop fallback), and
 * full cleanup. Renders exactly <canvas className="animated-backdrop" ...>.
 */

// ---- Shared GLSL body (no version / precision header; injected per GL version) ----
const FRAG_BODY = `
uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uPointer;     // eased pointer in 0..1, y already flipped to GL space
uniform float uPointerOn;   // 0..1 eased "active" amount

#define PI 3.14159265359

// brand colors
const vec3 C_GREEN = vec3(0.298, 1.000, 0.573);
const vec3 C_TEAL  = vec3(0.129, 0.902, 0.827);
const vec3 C_RED   = vec3(1.000, 0.200, 0.306);
const vec3 C_AMBER = vec3(1.000, 0.722, 0.286);
const vec3 C_BLUE  = vec3(0.322, 0.604, 1.000);
const vec3 C_BASE  = vec3(0.016, 0.027, 0.043);

// hash / value noise -------------------------------------------------
// Coordinates are wrapped before hashing so this stays well-behaved even on
// mediump-only fragment hardware (large gl_FragCoord magnitudes degrade the
// classic hash). 256.0 keeps the pattern dense without exceeding mediump range.
float hash21(vec2 p) {
  p = mod(p, 256.0);
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i + vec2(0.0, 0.0));
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// rotated octaves break axis-aligned tiling
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    v += amp * vnoise(p);
    p = rot * p * 2.02 + 11.3;
    amp *= 0.5;
  }
  return v;
}

// smooth-min union (polynomial) -- the gooey metaball glue
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

const vec3 C_PINK  = vec3(1.000, 0.298, 0.612);

// each blob carries its OWN vivid brand color so the field reads multi-color
// (a single global tint collapses to green). Selected by loop index via if-chain
// (robust on GLSL ES 1.00, which restricts dynamic const-array indexing).
vec3 brandColor(float i) {
  if (i < 0.5) return C_TEAL;
  if (i < 1.5) return C_BLUE;
  if (i < 2.5) return C_GREEN;
  if (i < 3.5) return C_AMBER;
  if (i < 4.5) return C_RED;
  return C_PINK;
}

void main() {
  vec2 res = uResolution;
  vec2 uv = gl_FragCoord.xy / res;          // 0..1
  // aspect-corrected space centered at 0, x widened by aspect
  float aspect = res.x / max(res.y, 1.0);
  vec2 p = (uv - 0.5);
  p.x *= aspect;

  float t = uTime;

  // pointer in centered aspect space (drives parallax + attractor)
  vec2 ptr = uPointer - 0.5;
  ptr.x *= aspect;

  // gentle parallax: shift the whole field slightly opposite the cursor
  vec2 par = -ptr * 0.05 * uPointerOn;

  // gentle global domain warp so the field breathes & never tiles (kept low so
  // the shapes stay coherent rather than smearing into one mass)
  vec2 warp = vec2(
    fbm(p * 1.1 + vec2(0.0, t * 0.045) + par),
    fbm(p * 1.1 + vec2(7.3, -t * 0.05) + par)
  );
  // warp amplitude MUST stay well below the blob radius, or blobs smear into one
  // connected sheet. This is a gentle wobble, not a displacement.
  vec2 pw = p + (warp - 0.5) * 0.06;

  // ---- accumulate a field of DISTINCT, individually-colored metaballs ----
  const int N = 6;
  float field = 1e3;
  vec3 colAccum = vec3(0.0);
  float wsum = 0.0;
  vec3 bloom = vec3(0.0);   // premultiplied colored glow (tight halos)

  for (int i = 0; i < N; i++) {
    float fi = float(i);
    float a = fi / float(N) * 6.2831853;
    // orbit on an ellipse + slow independent drift -> organic clusters that
    // periodically merge into liquid multi-colour shapes, then separate.
    // x-spread is damped so wide screens stay coherent, but wide enough that
    // the blobs populate the middle and left, not just the right.
    float spreadX = 0.45 * (0.7 + 0.3 * aspect);
    vec2 c = vec2(cos(a + t * 0.07), sin(a * 1.3 - t * 0.055)) * vec2(spreadX, 0.34);
    c += vec2(sin(t * 0.13 + fi * 2.1), cos(t * 0.1 + fi * 1.7)) * 0.17;
    // only a slight rightward bias so the cluster sits roughly centred and
    // covers left / middle / right
    c.x += 0.05 * aspect;
    // the cursor only gently nudges NEARBY blobs aside -- a light, local
    // interaction, not a ball that follows the mouse. Each blob keeps its own
    // autonomous orbit/drift; the mouse just adjusts them a little as it passes.
    vec2 toC = c - ptr;
    float dC = length(toC);
    c += (toC / (dC + 0.001)) * uPointerOn * 0.06 * exp(-dC * 2.3);

    // bigger radii + stronger smin -> visible gooey necks between neighbours
    float r = 0.094 + 0.026 * sin(t * 0.3 + fi * 2.3) + 0.006 * fi;
    float d = length(pw - c) - r;
    field = smin(field, d, 0.21);

    // color weight: strong inside, quick falloff (keeps hues distinct, not muddy)
    float w = exp(-max(d, 0.0) * 8.0);
    // per-blob color slowly morphs between adjacent brand hues -> "dynamic"
    vec3 bcol = mix(brandColor(fi), brandColor(mod(fi + 1.0, 6.0)), 0.5 + 0.5 * sin(t * 0.25 + fi));
    colAccum += bcol * w;
    wsum += w;

    // exponential colored bloom (soft luminous halo, never screen-filling)
    bloom += bcol * exp(-max(d, 0.0) * 12.0);
  }

  // NOTE: no dedicated cursor blob -- the pointer only nudges/parallaxes the
  // autonomous blobs above, so nothing "follows" the mouse.

  vec3 blobColor = colAccum / max(wsum, 0.0001);

  // subtle iridescent shimmer: lift brightness with a slow noise (kept bright)
  float shimmer = fbm(pw * 2.6 + t * 0.05);
  blobColor *= 0.95 + 0.5 * shimmer;

  // ---- surface masks ----
  float fill = smoothstep(0.015, -0.08, field);    // solid body -> reads as a shape
  // soft single edge glow (narrow, one-sided -> no concentric contour rings)
  float rim = smoothstep(0.045, 0.0, field) * smoothstep(-0.06, 0.0, field);
  float interior = smoothstep(0.0, -0.22, field);  // gentle volumetric core

  // ---- compose over a near-black base ----
  vec3 col = C_BASE;

  // faint flowing nebula haze so the black is never dead (reuse warp, no extra noise)
  float hz = warp.x;
  col += mix(C_TEAL, C_BLUE, hz) * 0.03 * (0.4 + 0.6 * hz);
  col += mix(C_RED, C_AMBER, warp.y) * 0.018 * warp.y;

  // body (brighter toward the core for depth / volume)
  col = mix(col, blobColor * (0.9 + 0.45 * interior), fill);
  // soft liquid edge highlight (single band -> creamy surface, no rings)
  col += blobColor * rim * 0.5;
  // colored additive bloom (the "premium" soft light)
  col += bloom * 0.4;

  // saturation boost so colours stay vivid through tone-mapping (not pastel),
  // counteracting the whitening where several coloured blobs overlap
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, 1.42);

  // gently calm only the far-left (where the big heading sits) so white text
  // stays legible, while still letting bubbles show through the middle/left
  float leftGuard = smoothstep(0.45, 0.02, uv.x);
  col *= 1.0 - leftGuard * 0.26;

  // radial vignette toward edges
  float vig = smoothstep(1.2, 0.35, length((uv - vec2(0.58, 0.46)) * vec2(aspect, 1.0)));
  col *= mix(0.58, 1.0, vig);

  // tone: keep overall luminance low, vivid accents
  col = col / (col + 0.92);           // soft filmic-ish compression
  col = pow(max(col, 0.0), vec3(0.90));

  // dithering to kill banding on dark tones
  float dither = (hash21(gl_FragCoord.xy + fract(t)) - 0.5) / 255.0;
  col += dither * 2.0;

  col = max(col, 0.0);
  FRAG_OUT = vec4(col, 1.0);
}
`;

const VERT_ES3 = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const VERT_ES1 = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

function buildFragSource(isWebGL2, precision) {
  const prec = precision || "highp";
  if (isWebGL2) {
    return (
      "#version 300 es\n" +
      "precision " +
      prec +
      " float;\n" +
      "out vec4 outColor_;\n" +
      "#define FRAG_OUT outColor_\n" +
      FRAG_BODY
    );
  }
  // WebGL1: gl_FragColor as the output target.
  return "precision " + prec + " float;\n" + "#define FRAG_OUT gl_FragColor\n" + FRAG_BODY;
}

export default function AnimatedBackdrop({ pointer }) {
  const canvasRef = useRef(null);
  const propPointerRef = useRef({ x: 0.5, y: 0.22, active: false });

  // keep latest prop pointer available to the rAF loop without re-running effect
  useEffect(() => {
    if (pointer) propPointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;

    // ---- self-tracked pointer (relative to canvas rect), eased each frame ----
    const target = { x: 0.62, y: 0.4, active: 0 };
    const smooth = { x: 0.62, y: 0.4, active: 0 };
    let selfTracked = false;

    const propTarget = () => {
      const p = propPointerRef.current || { x: 0.5, y: 0.22, active: false };
      return { x: p.x, y: p.y, active: p.active ? 1 : 0 };
    };

    // forward declarations (assigned below) so handlers can call them safely
    let renderOnce = () => {};

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = (e.clientY - rect.top) / rect.height;
      target.active = 1;
      selfTracked = true;
      if (reduceMotion) renderOnce();
    };
    // window 'pointerleave' rarely fires; rely on 'pointerout' to the document
    // boundary (relatedTarget === null) plus window blur to ease the cursor off.
    const handlePointerOut = (e) => {
      if (e.relatedTarget === null) {
        target.active = 0;
        if (reduceMotion) renderOnce();
      }
    };
    const handleBlur = () => {
      target.active = 0;
      if (reduceMotion) renderOnce();
    };

    // ---------------------------------------------------------------
    // 2D static fallback (no WebGL at all, or shader failure)
    // ---------------------------------------------------------------
    let usingFallback = false;
    let ctx2d = null;

    const drawFallback = () => {
      if (!ctx2d) {
        try {
          ctx2d = canvas.getContext("2d");
        } catch (err) {
          ctx2d = null;
        }
      }
      if (!ctx2d) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const h = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      const W = canvas.width;
      const H = canvas.height;
      ctx2d.setTransform(1, 0, 0, 1, 0, 0);
      ctx2d.clearRect(0, 0, W, H);
      const g = ctx2d.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#04070b");
      g.addColorStop(0.45, "#06121a");
      g.addColorStop(0.7, "#07140f");
      g.addColorStop(1, "#04060a");
      ctx2d.fillStyle = g;
      ctx2d.fillRect(0, 0, W, H);
      const blobs = [
        [W * 0.72, H * 0.38, "rgba(33,230,211,0.18)"],
        [W * 0.86, H * 0.66, "rgba(82,154,255,0.16)"],
        [W * 0.6, H * 0.7, "rgba(76,255,146,0.12)"],
        [W * 0.92, H * 0.28, "rgba(255,184,73,0.10)"],
      ];
      ctx2d.globalCompositeOperation = "lighter";
      for (let i = 0; i < blobs.length; i += 1) {
        const bx = blobs[i][0];
        const by = blobs[i][1];
        const color = blobs[i][2];
        const r = Math.max(W, H) * 0.34;
        const rg = ctx2d.createRadialGradient(bx, by, 0, bx, by, r);
        rg.addColorStop(0, color);
        rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx2d.fillStyle = rg;
        ctx2d.fillRect(0, 0, W, H);
      }
      ctx2d.globalCompositeOperation = "source-over";
      const shade = ctx2d.createLinearGradient(0, 0, W, 0);
      shade.addColorStop(0, "rgba(4,7,11,0.55)");
      shade.addColorStop(0.55, "rgba(4,7,11,0.0)");
      ctx2d.fillStyle = shade;
      ctx2d.fillRect(0, 0, W, H);
    };

    const enterFallback = () => {
      usingFallback = true;
      drawFallback();
    };

    // ---------------------------------------------------------------
    // WebGL setup
    // ---------------------------------------------------------------
    const ctxAttribs = { antialias: false, alpha: true, depth: false, stencil: false };
    let gl = null;
    let isWebGL2 = false;
    try {
      gl = canvas.getContext("webgl2", ctxAttribs);
      if (gl) {
        isWebGL2 = true;
      } else {
        gl =
          canvas.getContext("webgl", ctxAttribs) ||
          canvas.getContext("experimental-webgl", ctxAttribs);
      }
    } catch (err) {
      gl = null;
    }

    let program = null;
    let vbo = null;
    let uResolution = null;
    let uTime = null;
    let uPointer = null;
    let uPointerOn = null;
    let contextLost = false;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("AnimatedBackdrop shader compile error:\n" + gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    // Determine the best available fragment-shader float precision.
    const bestPrecision = () => {
      try {
        const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        if (hp && hp.precision > 0) return "highp";
      } catch (err) {
        /* ignore */
      }
      return "mediump";
    };

    const initGL = () => {
      const vsSrc = isWebGL2 ? VERT_ES3 : VERT_ES1;
      const fsSrc = buildFragSource(isWebGL2, bestPrecision());
      const vs = compile(gl.VERTEX_SHADER, vsSrc);
      const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
      if (!vs || !fs) {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        return false;
      }

      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.bindAttribLocation(program, 0, "aPos");
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("AnimatedBackdrop program link error:\n" + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        program = null;
        return false;
      }

      gl.useProgram(program);

      // fullscreen triangle
      vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      uResolution = gl.getUniformLocation(program, "uResolution");
      uTime = gl.getUniformLocation(program, "uTime");
      uPointer = gl.getUniformLocation(program, "uPointer");
      uPointerOn = gl.getUniformLocation(program, "uPointerOn");
      return true;
    };

    if (gl) {
      let ok = false;
      try {
        ok = initGL();
      } catch (err) {
        console.warn("AnimatedBackdrop GL init threw:", err);
        ok = false;
      }
      if (!ok) {
        enterFallback();
        gl = null;
      }
    } else {
      enterFallback();
    }

    // ---------------------------------------------------------------
    // sizing
    // ---------------------------------------------------------------
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const h = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };
    resize();

    // ---------------------------------------------------------------
    // render
    // ---------------------------------------------------------------
    let frameId = 0;
    let last = performance.now();
    let acc = reduceMotion ? 6.0 : 0.0; // delta-based time accumulator
    let running = false;

    const renderGL = () => {
      if (!gl || contextLost || !program) return;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, acc);
      // smoothed pointer; flip y for GL bottom-left origin
      gl.uniform2f(uPointer, smooth.x, 1.0 - smooth.y);
      gl.uniform1f(uPointerOn, smooth.active);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // assign the real implementation (was forward-declared above)
    renderOnce = () => {
      if (usingFallback) {
        drawFallback();
        return;
      }
      if (!gl || contextLost) return;
      const src = selfTracked ? target : propTarget();
      smooth.x = src.x;
      smooth.y = src.y;
      smooth.active = src.active || 0;
      resize();
      renderGL();
    };

    const loop = (now) => {
      if (!running) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.1) dt = 0.1; // clamp after pauses / tab switches
      if (dt < 0) dt = 0;
      acc += dt;

      // choose source: prefer self-tracked, fall back to prop
      const src = selfTracked ? target : propTarget();

      // silky eased pointer -- frame-rate-independent (converges ~0.06/frame at
      // 60fps, consistent on 120/144Hz and during frame drops)
      const k = 1 - Math.pow(1 - 0.06, Math.min(4, dt * 60));
      const ka = 1 - Math.pow(1 - 0.05, Math.min(4, dt * 60));
      smooth.x += (src.x - smooth.x) * k;
      smooth.y += (src.y - smooth.y) * k;
      smooth.active += (src.active - smooth.active) * ka;

      renderGL();
      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion || usingFallback || !gl || contextLost) return;
      running = true;
      last = performance.now();
      frameId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    // ---------------------------------------------------------------
    // runtime context-loss recovery
    // ---------------------------------------------------------------
    const handleContextLost = (e) => {
      e.preventDefault(); // required so the context can be restored
      contextLost = true;
      stop();
    };
    const handleContextRestored = () => {
      contextLost = false;
      program = null;
      vbo = null;
      let ok = false;
      try {
        ok = initGL();
      } catch (err) {
        ok = false;
      }
      if (!ok) {
        enterFallback();
        gl = null;
        renderOnce();
        return;
      }
      resize();
      if (reduceMotion) {
        renderOnce();
      } else if (!document.hidden) {
        start();
      }
    };

    // ---------------------------------------------------------------
    // listeners
    // ---------------------------------------------------------------
    const handleResize = () => {
      resize();
      if (reduceMotion || usingFallback) renderOnce();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (!reduceMotion && !usingFallback) {
        last = performance.now(); // reset delta so time does not jump
        start();
      }
    };

    const handleMotionChange = (e) => {
      reduceMotion = e.matches;
      if (reduceMotion) {
        stop();
        renderOnce();
      } else if (!usingFallback) {
        start();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(handleMotionChange);
    }

    // initial paint
    if (reduceMotion || usingFallback) {
      renderOnce();
    } else {
      start();
    }

    // ---------------------------------------------------------------
    // cleanup
    // ---------------------------------------------------------------
    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored, false);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      } else if (motionQuery.removeListener) {
        motionQuery.removeListener(handleMotionChange);
      }
      if (gl) {
        if (vbo) gl.deleteBuffer(vbo);
        if (program) gl.deleteProgram(program);
        // NOTE: intentionally do NOT call WEBGL_lose_context.loseContext() here.
        // Under React 19 <StrictMode> the effect runs mount->cleanup->mount, and
        // losing the context poisons the canvas so the second getContext() returns
        // the dead context, freezing the backdrop in dev. The GC reclaims the
        // context normally; the 'webglcontextlost' handler covers real GPU resets.
      }
    };
  }, []);

  return <canvas className="animated-backdrop" ref={canvasRef} aria-hidden="true" />;
}

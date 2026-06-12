"use client";

import React from "react";

/**
 * Lightweight WebGL animated backdrop — a warm, flowing amber/ember field
 * rendered entirely in a fragment shader. No external 3D library required.
 * Gracefully renders nothing (transparent) if WebGL is unavailable or the
 * user prefers reduced motion.
 */
const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

// classic value-noise + fbm
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 3.0;
  float t = u_time * 0.06;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7, 9.2) + t*0.5),
                fbm(p + 4.0*q + vec2(8.3, 2.8)));
  float f = fbm(p + 4.0*r);

  // warm palette: deep espresso -> amber -> gold highlight
  vec3 c1 = vec3(0.06, 0.04, 0.03);
  vec3 c2 = vec3(0.45, 0.22, 0.05);
  vec3 c3 = vec3(0.96, 0.66, 0.21);
  vec3 col = mix(c1, c2, clamp(f*f*1.6, 0.0, 1.0));
  col = mix(col, c3, clamp(length(r)*0.6, 0.0, 1.0));

  // subtle glow following the pointer
  float d = distance(uv, u_mouse);
  col += vec3(0.9, 0.6, 0.25) * 0.10 * smoothstep(0.6, 0.0, d);

  // vignette
  col *= 0.55 + 0.45 * smoothstep(1.1, 0.2, distance(uv, vec2(0.5)));
  fragColor = vec4(col, 1.0);
}`;

const VERT = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

export function WebGLBackground({ className }: { className?: string }) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
        if (!gl) return;

        const compile = (type: number, src: string) => {
            const sh = gl.createShader(type)!;
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            return sh;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW,
        );
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(prog, "u_res");
        const uTime = gl.getUniformLocation(prog, "u_time");
        const uMouse = gl.getUniformLocation(prog, "u_mouse");
        const mouse = { x: 0.5, y: 0.5 };

        const onMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) / rect.width;
            mouse.y = 1 - (e.clientY - rect.top) / rect.height;
        };
        window.addEventListener("pointermove", onMove);

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            canvas.width = Math.floor(canvas.clientWidth * dpr);
            canvas.height = Math.floor(canvas.clientHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener("resize", resize);

        let raf = 0;
        const start = performance.now();
        const render = (now: number) => {
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uTime, (now - start) / 1000);
            gl.uniform2f(uMouse, mouse.x, mouse.y);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
        };
    }, []);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CAMERA_PRESETS } from './config.js';
import { formatEstado, getEstado } from './lib/estado.js';
import { generarImagen } from './lib/image.js';
import { montarSecuencia } from './lib/montaje.js';
import { generarVideoFLF, generarVideoI2V } from './lib/video.js';

const server = new McpServer({
  name: 'wind-mcp',
  version: '1.0.0',
});

server.tool(
  'estado',
  'Verifica wind-comic local: server, MOCK_ENGINES, keys configuradas.',
  {},
  async () => {
    const estado = await getEstado();
    return {
      content: [{ type: 'text', text: formatEstado(estado) }],
    };
  },
);

server.tool(
  'generar_imagen',
  'Genera imagen madre (dispatchImageGenerate) y guarda en assets/arco-N/madre/.',
  {
    prompt: z.string().describe('Prompt EN (con STYLE-BLOCK si aplica)'),
    arco: z.number().int().positive(),
    id: z.string().describe('Ej. a3-m01'),
    slug: z.string().describe('Ej. madre-ornitorrinco'),
    aspect: z.enum(['16:9', '9:16', '1:1', '2.35:1', '4:3', '3:4']).optional(),
    refs: z.array(z.string()).optional().describe('URLs http de referencia'),
  },
  async (args) => {
    const result = await generarImagen({
      prompt: args.prompt,
      arco: args.arco,
      id: args.id,
      slug: args.slug,
      aspect: args.aspect,
      refs: args.refs,
    });
    return {
      content: [{
        type: 'text',
        text: [
          `Imagen generada: ${result.localPath}`,
          `provider: ${result.provider}`,
          `mock: ${result.mock}`,
          result.estCostCny != null ? `costo est.: ¥${result.estCostCny}` : '',
        ].filter(Boolean).join('\n'),
      }],
    };
  },
);

server.tool(
  'generar_video_i2v',
  'Imagen + motion prompt → clip 5-6-10-15s. Guarda en assets/arco-N/clips/.',
  {
    imagen: z.string().describe('Ruta local de imagen madre'),
    motionPrompt: z.string().max(500).describe('Motion prompt EN (sin lenguaje de cámara)'),
    arco: z.number().int().positive(),
    id: z.string(),
    slug: z.string(),
    duration: z.union([z.literal(5), z.literal(6), z.literal(10), z.literal(15)]).optional(),
    cameraPreset: z.enum(CAMERA_PRESETS).optional(),
    imageUrl: z.string().optional().describe('URL remota http de la imagen (si ya existe)'),
  },
  async (args) => {
    const result = await generarVideoI2V({
      imagen: args.imagen,
      imageUrl: args.imageUrl,
      motionPrompt: args.motionPrompt,
      arco: args.arco,
      id: args.id,
      slug: args.slug,
      duration: args.duration,
      cameraPreset: args.cameraPreset,
    });
    return {
      content: [{
        type: 'text',
        text: [
          `Clip generado: ${result.localPath}`,
          `provider: ${result.provider}`,
          `duration: ${result.duration}s`,
          `mock: ${result.mock}`,
          result.warning ? `warning: ${result.warning}` : '',
        ].filter(Boolean).join('\n'),
      }],
    };
  },
);

server.tool(
  'generar_video_flf',
  'Primer + último frame → clip 5 o 10s (Kling FLF o fallback).',
  {
    firstFrame: z.string(),
    lastFrame: z.string(),
    motionPrompt: z.string().max(500),
    arco: z.number().int().positive(),
    id: z.string(),
    slug: z.string(),
    duration: z.union([z.literal(5), z.literal(10)]).optional(),
    cameraPreset: z.enum(CAMERA_PRESETS).optional(),
    firstFrameUrl: z.string().optional(),
    lastFrameUrl: z.string().optional(),
  },
  async (args) => {
    const result = await generarVideoFLF({
      firstFrame: args.firstFrame,
      lastFrame: args.lastFrame,
      firstFrameUrl: args.firstFrameUrl,
      lastFrameUrl: args.lastFrameUrl,
      motionPrompt: args.motionPrompt,
      arco: args.arco,
      id: args.id,
      slug: args.slug,
      duration: args.duration,
      cameraPreset: args.cameraPreset,
    });
    return {
      content: [{
        type: 'text',
        text: [
          `Clip FLF: ${result.localPath}`,
          `provider: ${result.provider}`,
          result.warning ? `warning: ${result.warning}` : '',
        ].filter(Boolean).join('\n'),
      }],
    };
  },
);

server.tool(
  'montar_secuencia',
  'Concatena clips con ffmpeg (+ audio opcional) y exporta 9:16.',
  {
    clips: z.array(z.string()).min(1).describe('Rutas de clips en orden'),
    salida: z.string().describe('Ruta de salida .mp4'),
    audio: z.string().optional().describe('Ruta de audio (off grabado)'),
    aspect: z.enum(['9:16', '16:9']).optional(),
  },
  async (args) => {
    const result = await montarSecuencia({
      clips: args.clips,
      salida: args.salida,
      audio: args.audio,
      aspect: args.aspect,
    });
    return {
      content: [{
        type: 'text',
        text: `Reel montado: ${result.localPath} (${result.clipCount} clips${result.hasAudio ? ', con audio' : ''})`,
      }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('[wind-mcp] fatal:', err);
  process.exit(1);
});

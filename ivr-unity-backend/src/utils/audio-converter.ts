/**
 * Audio conversion utilities for μ-law (PCMU) <-> Linear PCM
 *
 * Telnyx uses μ-law (PCMU) at 8kHz
 * ElevenLabs expects Linear PCM 16-bit at 16kHz
 */

// μ-law to Linear PCM lookup table
const MULAW_TO_LINEAR: Int16Array = new Int16Array(256);
const LINEAR_TO_MULAW: Uint8Array = new Uint8Array(65536);

// Initialize lookup tables
(function initTables() {
  // μ-law to linear conversion
  for (let i = 0; i < 256; i++) {
    const mulaw = ~i;
    const sign = (mulaw & 0x80) ? -1 : 1;
    const exponent = (mulaw >> 4) & 0x07;
    const mantissa = mulaw & 0x0f;
    const sample = sign * ((mantissa << 3) + 0x84) << exponent;
    MULAW_TO_LINEAR[i] = sample;
  }

  // Linear to μ-law conversion
  const MULAW_MAX = 0x1fff;
  const MULAW_BIAS = 33;

  for (let i = 0; i < 65536; i++) {
    let sample = (i < 32768) ? i : i - 65536;
    const sign = (sample < 0) ? 0x80 : 0x00;
    if (sign) sample = -sample;
    sample = Math.min(sample + MULAW_BIAS, MULAW_MAX);

    let exponent = 7;
    for (let expMask = 0x1000; (sample & expMask) === 0 && exponent > 0; expMask >>= 1) {
      exponent--;
    }

    const mantissa = (sample >> (exponent + 3)) & 0x0f;
    LINEAR_TO_MULAW[i] = ~(sign | (exponent << 4) | mantissa) & 0xff;
  }
})();

/**
 * Convert μ-law buffer to 16-bit Linear PCM
 */
export function mulawToLinear(mulawData: Buffer): Buffer {
  const linearData = Buffer.alloc(mulawData.length * 2);

  for (let i = 0; i < mulawData.length; i++) {
    const sample = MULAW_TO_LINEAR[mulawData[i]];
    linearData.writeInt16LE(sample, i * 2);
  }

  return linearData;
}

/**
 * Convert 16-bit Linear PCM to μ-law
 */
export function linearToMulaw(linearData: Buffer): Buffer {
  const mulawData = Buffer.alloc(linearData.length / 2);

  for (let i = 0; i < mulawData.length; i++) {
    const sample = linearData.readInt16LE(i * 2);
    const index = (sample < 0) ? sample + 65536 : sample;
    mulawData[i] = LINEAR_TO_MULAW[index];
  }

  return mulawData;
}

/**
 * Upsample from 8kHz to 16kHz using linear interpolation
 */
export function upsample8to16(data: Buffer): Buffer {
  const samples = data.length / 2;
  const upsampled = Buffer.alloc(samples * 4);

  for (let i = 0; i < samples - 1; i++) {
    const current = data.readInt16LE(i * 2);
    const next = data.readInt16LE((i + 1) * 2);
    const interpolated = Math.round((current + next) / 2);

    upsampled.writeInt16LE(current, i * 4);
    upsampled.writeInt16LE(interpolated, i * 4 + 2);
  }

  // Handle last sample
  const lastSample = data.readInt16LE((samples - 1) * 2);
  upsampled.writeInt16LE(lastSample, (samples - 1) * 4);
  upsampled.writeInt16LE(lastSample, (samples - 1) * 4 + 2);

  return upsampled;
}

/**
 * Downsample from 16kHz to 8kHz
 */
export function downsample16to8(data: Buffer): Buffer {
  const samples = data.length / 2;
  const downsampled = Buffer.alloc(samples / 2 * 2);

  for (let i = 0; i < samples / 2; i++) {
    // Average every 2 samples
    const s1 = data.readInt16LE(i * 4);
    const s2 = data.readInt16LE(i * 4 + 2);
    const averaged = Math.round((s1 + s2) / 2);
    downsampled.writeInt16LE(averaged, i * 2);
  }

  return downsampled;
}

/**
 * Convert Telnyx μ-law 8kHz to ElevenLabs PCM 16kHz
 */
export function telnyxToElevenLabs(mulawData: Buffer): Buffer {
  const linear8k = mulawToLinear(mulawData);
  return upsample8to16(linear8k);
}

/**
 * Convert ElevenLabs PCM 16kHz to Telnyx μ-law 8kHz
 */
export function elevenLabsToTelnyx(pcm16kData: Buffer): Buffer {
  const pcm8k = downsample16to8(pcm16kData);
  return linearToMulaw(pcm8k);
}

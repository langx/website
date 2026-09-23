export type VoiceCredit = { name: string; url: string; licence: string };

/**
 * The voices whose licence asks to be named, by language — the `attribution`
 * lines of `SPEECH_VOICES` in the app's `packages/shared/src/speech.ts`, which
 * is where `scripts/wordlists/tts_voices.py` takes its voices from. The
 * rest are CC0, MIT or Apache-2.0 and ask for nothing.
 */
export const VOICE_CREDITS: Record<string, VoiceCredit> = {
	bn: { name: 'google (bn_BD)', url: 'http://www.openslr.org/37/', licence: 'CC BY-SA 4.0' },
	ca: {
		name: 'upc_ona (ca_ES)',
		url: 'https://collectivat.cat/asr#upc-festcat-tts-corpora',
		licence: 'CC BY-SA 4.0'
	},
	et: {
		name: 'news (et_EE)',
		url: 'https://metashare.ut.ee/repository/browse/speech-corpus-of-estonian-news-sentences/37b7c5d6a0d411eebb4773db10791bcfb0c0cf788d2d4030bfaf2f2e6e55dd8d/',
		licence: 'CC BY 4.0'
	},
	sl: {
		name: 'artur (sl_SI)',
		url: 'https://huggingface.co/datasets/ppisljar/artur_studio_tts/',
		licence: 'CC BY 4.0'
	},
	vi: {
		name: 'vais1000 (vi_VN)',
		url: 'https://ieee-dataport.org/documents/vais-1000-vietnamese-speech-synthesis-corpus',
		licence: 'CC BY 4.0'
	}
};

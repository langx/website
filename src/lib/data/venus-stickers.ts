/**
 * The Venus sticker pack as it ships in the app (langx/langx#2052): one row
 * per sticker, in pack order. Each `file` is a WebP in
 * static/images/venus/stickers/, cut to 192px from the pack's 512px PNGs; the
 * same PNGs are in the download, static/images/venus/venus-langx-stickers.zip.
 * A new pack swaps the files, the zip and this list, and the page follows.
 */
export interface VenusSticker {
	file: string;
	name: string;
	/** Set when the sticker carries words in one language. */
	lang?: string;
}

export const venusStickers: VenusSticker[] = [
	{ file: '01-hi', name: 'Hi' },
	{ file: '02-love', name: 'Love' },
	{ file: '03-lol', name: 'Laughing' },
	{ file: '04-ok', name: 'OK' },
	{ file: '05-no', name: 'No' },
	{ file: '06-sorry', name: 'Sorry' },
	{ file: '07-crying', name: 'Crying' },
	{ file: '08-shocked', name: 'Shocked' },
	{ file: '09-thinking', name: 'Thinking' },
	{ file: '10-celebrate', name: 'Celebrate' },
	{ file: '11-proud', name: 'Proud in her bag' },
	{ file: '12-slow-blink', name: 'Slow blink' },
	{ file: '13-squint', name: 'Suspicious squint' },
	{ file: '14-blep', name: 'Blep' },
	{ file: '15-typing', name: 'Typing…' },
	{ file: '16-boop', name: 'Boop' },
	{ file: '17-sleepy', name: 'Sleepy' },
	{ file: '18-diva', name: 'Diva in a hoodie' },
	{ file: '19-hamsi', name: 'Hamsi for dinner' },
	{ file: '20-treat', name: 'The treat tube' },
	{ file: '21-empty-bowl', name: 'The empty bowl' },
	{ file: '22-chicken', name: 'Boiled chicken' },
	{ file: '23-knock-off', name: 'Knocked it off' },
	{ file: '24-box-hide', name: 'Hiding in a box' },
	{ file: '25-belly-up', name: 'Belly up' },
	{ file: '26-zoomies', name: 'Zoomies' },
	{ file: '27-meant-it', name: 'I meant to do that' },
	{ file: '28-yuck', name: 'Yuck' },
	{ file: '29-notes', name: 'On your notes' },
	{ file: '30-knead', name: 'Making biscuits' },
	{ file: '31-startle', name: 'Startled' },
	{ file: '32-hunt', name: 'Ready to pounce' },
	{ file: '33-gift', name: 'A gift for you' },
	{ file: '34-groom', name: 'Busy grooming' },
	{ file: '35-offended', name: 'Offended' },
	{ file: '36-wasnt-me', name: 'Wasn’t me' },
	{ file: '37-shy', name: 'Shy' },
	{ file: '38-listening', name: 'Listening' },
	{ file: '39-thanks-en', name: 'Thanks!', lang: 'en' },
	{ file: '40-good-morning', name: 'Good morning!', lang: 'en' },
	{ file: '41-good-night', name: 'Good night', lang: 'en' },
	{ file: '42-practise', name: 'Let’s practise!', lang: 'en' },
	{ file: '43-well-done', name: 'Well done!', lang: 'en' },
	{ file: '44-miss-you', name: 'Miss you', lang: 'en' },
	{ file: '45-oops', name: 'Oops!', lang: 'en' },
	{ file: '46-hello-en', name: 'Hello!', lang: 'en' },
	{ file: '47-hello-es', name: '¡Hola!', lang: 'es' },
	{ file: '48-hello-pt-BR', name: 'Olá!', lang: 'pt-BR' },
	{ file: '49-hello-fr', name: 'Bonjour!', lang: 'fr' },
	{ file: '50-hello-de', name: 'Hallo!', lang: 'de' },
	{ file: '51-hello-tr', name: 'Merhaba!', lang: 'tr' },
	{ file: '52-hello-ru', name: 'Привет!', lang: 'ru' },
	{ file: '53-hello-ar', name: 'مرحبا', lang: 'ar' },
	{ file: '54-thanks-es', name: '¡Gracias!', lang: 'es' },
	{ file: '55-thanks-pt-BR', name: 'Obrigada!', lang: 'pt-BR' },
	{ file: '56-thanks-fr', name: 'Merci!', lang: 'fr' },
	{ file: '57-thanks-de', name: 'Danke!', lang: 'de' },
	{ file: '58-thanks-tr', name: 'Teşekkürler!', lang: 'tr' },
	{ file: '59-thanks-ru', name: 'Спасибо!', lang: 'ru' },
	{ file: '60-thanks-ar', name: 'شكرا', lang: 'ar' }
];

// Audio Generation Script for Word Club
// Uses Google Translate TTS (free, no auth required)

const fs = require('fs');
const https = require('https');
const path = require('path');

const WORDS = require('./words.js').WORDS;

// Google Translate TTS endpoint
function getGoogleTTSUrl(text, lang = 'en') {
    const encodedText = encodeURIComponent(text);
    return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=${lang}&total=1&idx=0&textlen=${text.length}`;
}

// Download audio file
function downloadAudio(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filename);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filename, () => {});
            reject(err);
        });
    });
}

// Generate filename from word
function getFilename(word) {
    // Replace special characters and spaces with underscores
    return word.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[ä]/g, 'a')
        .replace(/[ö]/g, 'o')
        .replace(/[ü]/g, 'u')
        .replace(/[ß]/g, 'ss')
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

// Main generation function
async function generateAllAudio() {
    const audioDir = path.join(__dirname, 'audio');

    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    console.log(`\n🎙️  Generating audio for ${WORDS.length} words...\n`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < WORDS.length; i++) {
        const word = WORDS[i];
        const filename = getFilename(word);
        const filepath = path.join(audioDir, `${filename}.mp3`);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`⏭️  [${i + 1}/${WORDS.length}] Skipping "${word}" (already exists)`);
            success++;
            continue;
        }

        try {
            const url = getGoogleTTSUrl(word);
            await downloadAudio(url, filepath);
            console.log(`✅ [${i + 1}/${WORDS.length}] Generated "${word}" -> ${filename}.mp3`);
            success++;

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`❌ [${i + 1}/${WORDS.length}] Failed "${word}": ${error.message}`);
            failed++;
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📁 Audio files saved to: ${audioDir}`);
    console.log(`${'='.repeat(50)}\n`);
}

// Run the script
generateAllAudio().catch(console.error);

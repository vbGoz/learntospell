# Audio Files for Word Club

## Overview
This directory contains pre-recorded audio files for all 221 spelling bee words used in the Word Club app.

## Audio Details
- **Total Files**: 221
- **Voice**: Allison (macOS built-in voice)
- **Format**: AIFF (Audio Interchange File Format)
- **Speech Rate**: 170 words per minute (slower, clearer)
- **Total Size**: ~8.0 MB
- **Quality**: High-quality, native macOS voice

## Generation
These files were generated using macOS's built-in `say` command with the Allison voice, which is significantly clearer than the default Samantha voice.

### Regenerating Audio Files
If you need to regenerate the audio files:

```bash
# Make script executable (first time only)
chmod +x ../generate-audio-macos.sh

# Run the generation script
../generate-audio-macos.sh
```

### Customizing Voice
Edit `generate-audio-macos.sh` and change the `VOICE` variable to use a different macOS voice:

```bash
# Available voices (uncomment your preferred choice):
# VOICE="Samantha"    # Default female
# VOICE="Alex"        # Default male
VOICE="Allison"       # Clear female (RECOMMENDED) ✓
# VOICE="Ava"         # Premium female voice
# VOICE="Tom"         # Clear male
```

To see all available voices on your Mac:
```bash
say -v ?
```

## File Naming Convention
Files are named using lowercase letters with special characters normalized:
- Accented characters converted to ASCII (é → e, ñ → n, etc.)
- Spaces replaced with underscores (cri de coeur → cri_de_coeur.aiff)
- Special characters removed (pince-nez → pincenez.aiff)

## Usage in App
The app automatically loads these audio files using the `getAudioFilename()` function which converts words to filenames using the same normalization rules.

## Browser Compatibility
AIFF format is supported by:
- ✅ Safari (macOS, iOS)
- ✅ Chrome (all platforms)
- ✅ Firefox (all platforms)
- ✅ Edge (all platforms)

## Why Pre-recorded?
1. **Consistent Quality**: Same clear voice for all users across all browsers
2. **No API Dependencies**: Works offline, no rate limits, no authentication
3. **Faster**: Instant playback without synthesis delays
4. **Reliable**: No browser compatibility issues with TTS engines
5. **Free**: One-time generation, unlimited use

## Alternative Generation Methods
If you're not on macOS, see `audio-generator.html` for a browser-based generator or `generate-audio.js` for a Node.js approach (requires internet connection).

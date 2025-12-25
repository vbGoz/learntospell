# Audio Files for Word Club

## Overview
This directory contains pre-recorded audio files for all 221 spelling bee words used in the Word Club app.

## Audio Details
- **Total Files**: 221
- **Voice**: Allison (macOS built-in voice)
- **Format**: M4A (AAC audio) - **Optimized for mobile!**
- **Speech Rate**: 170 words per minute (slower, clearer)
- **Total Size**: ~2.0 MB (80% smaller than AIFF!)
- **Quality**: High-quality, native macOS voice

## Why M4A Format?
We converted from AIFF to M4A for better mobile compatibility:
- ✅ **Universal mobile support** (iOS Safari, Android Chrome)
- ✅ **80% smaller file sizes** (better for mobile networks)
- ✅ **Hardware-accelerated playback** on mobile devices
- ✅ **No more jarring/choppy audio** on phones
- ✅ **Faster loading** over cellular connections

## Generation
These files were originally generated using macOS's built-in `say` command with the Allison voice, then converted to M4A format for mobile optimization.

### Regenerating Audio Files
If you need to regenerate the audio files:

```bash
# Generate AIFF files (first time only)
chmod +x ../generate-audio-macos.sh
../generate-audio-macos.sh

# Convert to M4A for mobile compatibility
chmod +x ../convert-to-m4a.sh
../convert-to-m4a.sh
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
- Spaces replaced with underscores (cri de coeur → cri_de_coeur.m4a)
- Special characters removed (pince-nez → pincenez.m4a)
- Extension: `.m4a` (AAC audio format)

## Usage in App
The app automatically loads these audio files using the `getAudioFilename()` function which converts words to filenames using the same normalization rules.

## Browser Compatibility
M4A/AAC format has excellent support:
- ✅ Safari (macOS, iOS) - Native support, hardware-accelerated
- ✅ Chrome (all platforms) - Full support
- ✅ Firefox (all platforms) - Full support
- ✅ Edge (all platforms) - Full support
- ✅ Mobile browsers - Optimized for mobile playback

**Previous AIFF format had poor mobile support and caused choppy playback on phones.**

## Why Pre-recorded?
1. **Consistent Quality**: Same clear voice for all users across all browsers
2. **No API Dependencies**: Works offline, no rate limits, no authentication
3. **Faster**: Instant playback without synthesis delays
4. **Reliable**: No browser compatibility issues with TTS engines
5. **Free**: One-time generation, unlimited use
6. **Mobile Optimized**: M4A format ensures smooth playback on phones

## Alternative Generation Methods
If you're not on macOS, see `audio-generator.html` for a browser-based generator or `generate-audio.js` for a Node.js approach (requires internet connection).

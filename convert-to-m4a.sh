#!/bin/bash
# Convert all AIFF audio files to M4A (AAC) for better mobile compatibility

AUDIO_DIR="/Users/vbgoz/git/learntospell/audio"
total=$(ls "$AUDIO_DIR"/*.aiff 2>/dev/null | wc -l | tr -d " ")

if [ "$total" -eq 0 ]; then
    echo "❌ No AIFF files found in $AUDIO_DIR. Run generate-audio-macos.sh first."
    exit 1
fi

echo "🔊 Converting $total AIFF files to M4A (AAC) for mobile compatibility..."
echo ""

count=0

for file in "$AUDIO_DIR"/*.aiff; do
    if [ -f "$file" ]; then
        basename=$(basename "$file" .aiff)
        output="$AUDIO_DIR/${basename}.m4a"

        count=$((count + 1))
        printf "\r[%3d/%d] Converting: %-50s" "$count" "$total" "$basename"

        # Convert AIFF to M4A (AAC) with default quality
        afconvert -f m4af -d aac "$file" "$output" 2>/dev/null

        if [ $? -ne 0 ]; then
            echo ""
            echo "❌ Failed to convert: $file"
            exit 1
        fi
    fi
done

echo ""
echo ""
echo "✅ Successfully converted all $total files to M4A format!"
echo ""
echo "📊 File size comparison:"
aiff_size=$(du -sh "$AUDIO_DIR" | awk '{print $1}')
m4a_count=$(ls "$AUDIO_DIR"/*.m4a 2>/dev/null | wc -l | tr -d ' ')
echo "   Audio directory size: $aiff_size"
echo "   M4A files created: $m4a_count"
echo ""
echo "🎯 M4A benefits:"
echo "   • Better mobile browser support (iOS Safari, Android Chrome)"
echo "   • ~80% smaller file sizes (better for mobile networks)"
echo "   • Hardware-accelerated playback on mobile devices"
echo "   • No more jarring/choppy audio on phones!"
echo ""

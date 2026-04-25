/**
 * Extract video ID from various YouTube URL formats
 */
export function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  throw new Error("Could not extract video ID from URL");
}

/**
 * Fetch YouTube video transcript
 * Returns the full text transcript or a fallback message
 */
export async function fetchTranscript(youtubeUrl: string): Promise<string> {
  try {
    const videoId = extractVideoId(youtubeUrl);

    // Try to use youtube-transcript library if available
    try {
      const { fetchTranscript: fetchYoutubeTranscript } = await import(
        "youtube-transcript"
      );
      const transcriptData = await fetchYoutubeTranscript(videoId);
      return transcriptData.map((item: { text: string }) => item.text).join(" ");
    } catch (importError) {
      // youtube-transcript not available or failed
      console.warn(
        "youtube-transcript library not available. Install with: npm install youtube-transcript"
      );

      // Fallback: return a placeholder message
      return `[Transcript unavailable for video ID: ${videoId}]\n\nTo fetch actual transcripts, install the youtube-transcript library:\nnpm install youtube-transcript\n\nThen the agent will automatically fetch the real transcript.`;
    }
  } catch (error) {
    throw new Error(`Failed to fetch transcript: ${String(error)}`);
  }
}

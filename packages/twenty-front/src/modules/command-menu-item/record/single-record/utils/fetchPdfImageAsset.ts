export const fetchPdfImageAsset = async (url: string): Promise<Blob> => {
  try {
    const response = await fetch(url, { mode: 'cors', credentials: 'omit' });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch asset at ${url}: ${response.status} ${response.statusText}`,
      );
    }

    return await response.blob();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Failed to fetch asset')
    ) {
      throw error;
    }

    throw new Error(
      `Failed to fetch asset at ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

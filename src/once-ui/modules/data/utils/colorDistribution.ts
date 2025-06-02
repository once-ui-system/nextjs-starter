import { schemes } from "../../../types";

/**
 * Returns a color from the schemes array with even distribution
 * Instead of sequential colors (0,1,2), this distributes them evenly across the color spectrum
 * For small sets (2-4 items), uses a predefined optimal distribution
 * @param index The index of the item in the series
 * @param totalItems Total number of items in the series (if known)
 * @returns A color from the schemes array
 */
export const getDistributedColor = (index: number, totalItems?: number): string => {
  const totalColors = schemes.length;

  // For small sets, use predefined optimal distributions
  if (totalItems) {
    // Special case for 3 items - use blue, orange, cyan (maximally distinct)
    if (totalItems === 3) {
      const optimalIndices = [0, 6, 12]; // blue, orange, cyan
      return schemes[optimalIndices[index % 3]];
    }

    // Special case for 2 items - use blue and orange (complementary colors)
    if (totalItems === 2) {
      const optimalIndices = [0, 6]; // blue, orange
      return schemes[optimalIndices[index % 2]];
    }

    // Special case for 4 items - use blue, orange, green, magenta (balanced tetrad)
    if (totalItems === 4) {
      const optimalIndices = [0, 6, 9, 3]; // blue, orange, green, magenta
      return schemes[optimalIndices[index % 4]];
    }

    // For 5+ items, use a more sophisticated distribution
    if (totalItems > 1) {
      // Use a prime number as step to avoid repetitive patterns
      // and ensure better distribution across the spectrum
      const step = Math.max(1, Math.floor(totalColors / totalItems));
      const offset = Math.floor(totalColors / (2 * totalItems)); // Add offset for better distribution
      return schemes[(index * step + offset) % totalColors];
    }
  }

  // If we don't know the total or there's only one item,
  // use a simple distribution based on the golden ratio
  // This creates a visually pleasing distribution even as items are added one by one
  const goldenRatioConjugate = 0.618033988749895;
  const hue = (index * goldenRatioConjugate) % 1;
  const colorIndex = Math.floor(hue * totalColors);

  return schemes[colorIndex];
};

export function batchCount(items, capacity) {
  if (!Number.isInteger(items) || items < 0 || !Number.isInteger(capacity) || capacity <= 0) {
    throw new RangeError('Use nonnegative whole items and positive whole capacity.');
  }
  return Math.floor(items / capacity);
}

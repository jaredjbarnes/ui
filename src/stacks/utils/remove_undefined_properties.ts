export function removeUndefinedProperties<T extends object>(obj: T) {
  const result: any = {};

  Object.keys(obj).forEach((k) => {
    if (typeof (obj as any)[k] !== 'undefined') {
      result[k] = (obj as any)[k];
    }
  });

  return result;
}

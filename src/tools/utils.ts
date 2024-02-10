export function getFields<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): Partial<T> {
    const resultObject: Partial<T> = {};
    fields.forEach((key) => {
      if (key in obj) {
        resultObject[key] = obj[key];
      }
    });
    return resultObject;
  }
  
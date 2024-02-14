import 'reflect-metadata';

// Define a decorator to store metadata
function MyAttribute(target: any, key: string) {
  Reflect.defineMetadata('myAttribute', true, target, key);
}

// Example class with decorated properties
class MyClass {
  @MyAttribute
  public property1: string;

  @MyAttribute
  public property2: number;
}

// Function to get attributes of a class
function getAttributes(target: any): string[] {
  const attributes: string[] = [];
  const prototype = Object.getPrototypeOf(target);

  // Iterate through each property of the class
  for (const key of Object.getOwnPropertyNames(prototype)) {
    // Check if the property has the MyAttribute metadata
    if (Reflect.getMetadata('myAttribute', prototype, key)) {
      attributes.push(key);
    }
  }

  return attributes;
}

// Get attributes of the MyClass
const myClassAttributes = getAttributes(MyClass);
console.log('Attributes of MyClass:', myClassAttributes);

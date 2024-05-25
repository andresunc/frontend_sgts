export function memoize(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map();

    descriptor.value = function (...args: any[]) {
        const cacheKey = JSON.stringify(args);
        if (!cache.has(cacheKey)) {
            cache.set(cacheKey, originalMethod.apply(this, args));
        }
        return cache.get(cacheKey);
    };

    return descriptor;
}  
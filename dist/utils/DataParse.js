"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = groupByMap;
function groupByMap(arr, keyFn) {
    const map = new Map();
    for (const item of arr) {
        const key = keyFn(item);
        if (!map.has(key))
            map.set(key, []);
        map.get(key).push(item);
    }
    return map;
}

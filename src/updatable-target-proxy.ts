/*-
 * ‌
 * Hedera Hardhat Hethers
 * ​
 * Copyright (C) 2022 - 2023 Hedera Hashgraph, LLC
 * ​
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ‍
 */

/**
 * Returns a read-only proxy that just forwards everything to a target,
 * and a function that can be used to change that underlying target
 */
export function createUpdatableTargetProxy<T extends object>(
    initialTarget: T
): {
    proxy: T;
    setTarget: (target: T) => void;
} {
    const targetObject = {
        target: initialTarget,
    };

    let isExtensible = Object.isExtensible(initialTarget);

    // @ts-ignore
    const handler: Required<ProxyHandler<T>> = {
        // these two functions are implemented because of the Required<ProxyHandler> type
        apply(_, _thisArg, _argArray) {
            throw new Error(
                "cannot be implemented because the target is not a function"
            );
        },

        construct(_, _argArray, _newTarget) {
            throw new Error(
                "cannot be implemented because the target is not a function"
            );
        },

        defineProperty(_, property, _descriptor) {
            throw new Error(
                `cannot define property ${String(property)} in read-only proxy`
            );
        },

        deleteProperty(_, property) {
            throw new Error(
                `cannot delete property ${String(property)} in read-only proxy`
            );
        },

        get(_, property, receiver) {
            const result = Reflect.get(targetObject.target, property, receiver);

            if (result instanceof Function) {
                return result.bind(targetObject.target);
            }

            return result;
        },

        getOwnPropertyDescriptor(_, property) {
            const descriptor = Reflect.getOwnPropertyDescriptor(
                targetObject.target,
                property
            );

            if (descriptor !== undefined) {
                Object.defineProperty(targetObject.target, property, descriptor);
            }

            return descriptor;
        },

        getPrototypeOf(_) {
            return Reflect.getPrototypeOf(targetObject.target);
        },

        has(_, property) {
            return Reflect.has(targetObject.target, property);
        },

        isExtensible(_) {
            // we need to return the extensibility value of the original target
            return isExtensible;
        },

        ownKeys(_) {
            return Reflect.ownKeys(targetObject.target);
        },

        preventExtensions(_) {
            isExtensible = false;
            return Reflect.preventExtensions(targetObject.target);
        },

        set(_, property, _value, _receiver) {
            throw new Error(
                `cannot set property ${String(property)} in read-only proxy`
            );
        },

        setPrototypeOf(_, _prototype) {
            throw new Error("cannot change the prototype in read-only proxy");
        },
    };

    const proxy: T = new Proxy(initialTarget, handler);

    const setTarget = (newTarget: T) => {
        targetObject.target = newTarget;
    };

    return {proxy, setTarget};
}

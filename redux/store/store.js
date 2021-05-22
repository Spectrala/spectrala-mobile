import { createStore } from 'redux';
import rootReducer from '../reducers/reducer';
import { Provider } from 'react-redux';
import React, { useState, useCallback, useEffect } from 'react';

// This module provides functionality for reinitializing redux store at arbitrary times.
// This is accomplished by defining a custom store provider that can be overriden at any time
// with a new store. This new store is then passed to the root Provider component which wraps any passed children.

// Store must be an object so its mutable
export const store = {
    store: undefined,
    // key ensures a NEW Provider component is created after store recreation,
    // rather than just updating the store prop, which would cause an error.
    key: 0,
    force_root_rerender: undefined,
};

// Only ever make one of these!
export function RecreatableGlobalStoreProvider(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    // on mount and unmount, update the callback to force us to rerender.
    useEffect(() => {
        if (store.force_root_rerender) {
            throw new Error(
                'Tried to create more than one RecreatableGlobalStoreProvider at one time!'
            );
        }
        store.force_root_rerender = forceUpdate;
        return () => {
            store.force_root_rerender = undefined;
        };
    }, [forceUpdate]);

    return (
        <Provider store={store.store} key={store.key}>
            {props.children}
        </Provider>
    );
}

// make a new store and force a rerender of the RecreatableGlobalStoreProvider
// This is also the logic by which the store will always be created.
export const recreateStore = (preload_state) => {
    store.key++;
    store.store = createStore(
        rootReducer,
        preload_state,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    if (store.force_root_rerender) {
        store.force_root_rerender();
    }
};
// On module import, create the first store.
recreateStore(undefined);

import { createSlice } from '@reduxjs/toolkit';

/**
 * Adjustments: An object representing the sliders for modifying attributes
 * of video input (brightness/contrast/hue/saturation).
 *   value: The number between 0 and 100 the slider is set to.
 *   title: The label the user sees.
 */
export const defaultAdjustments = {
    brightness: { value: 50, title: 'Brightness' },
    contrast: { value: 50, title: 'Contrast' },
    hue: { value: 50, title: 'Hue' },
    saturation: { value: 50, title: 'Saturation' },
};

/**
 * interfaceOrder: An array to define the order in which to display the adjustment sliders.
 */
export const interfaceOrder = ['brightness', 'contrast', 'hue', 'saturation'];

export const adjustmentsSlice = createSlice({
    name: 'adjustments',
    initialState: {
        adjustments: defaultAdjustments,
    },
    reducers: {
        setValue: (state, action) => {
            const target = interfaceOrder[action.payload.targetIndex];
            state.adjustments[target].value = action.payload.value;
        },
        setDefault: (state) => {
            state.adjustments = defaultAdjustments;
        },
    },
});

export const { setValue, setDefault } = adjustmentsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.adjustments.value)`
export const selectAdjustment = (state, target) =>
    state.adjustments.adjustments[target];

export const selectAdjustments = (state) =>
    interfaceOrder.map((target) => selectAdjustment(state, target));

export default adjustmentsSlice.reducer;

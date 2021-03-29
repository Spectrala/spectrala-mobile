import {
    MINIMUM_WAVELENGTH,
    MAXIMUM_WAVELENGTH,
} from './calibration_constants';

// This module contains utilities for working with calibration points, which are of the form:
// {
//     wavelength: Number,
//     placement: Number | null,
//     isBeingPlaced: Boolean,
// }
// This is not a class because it must go into the Redux store and therefore be serializable.
// For ergononomics, use it like "import * as CalibPt from 'path/to/file'"

export const construct = (wavelength, placement, isBeingPlaced) => ({
    wavelength,
    placement,
    isBeingPlaced,
});
export const getPlacement = (cp) => cp.placement;
export const getWavelength = (cp) => cp.wavelength;
export const hasBeenPlaced = (cp) => !!cp.placement;
export const getWavelengthDescription = (cp) => cp.wavelength + 'nm';
export const getPlacementLocationDescription = (cp) => {
    if (!hasBeenPlaced(cp)) {
        return null;
    }
    return {
        wavelength: getWavelengthDescription(cp),
        rawWavelength: cp.wavelength,
        placement: cp.placement,
    };
};
export const getPlacementStatusDescription = (cp) => ({
    isBeingPlaced: cp.isBeingPlaced,
    hasBeenPlaced: hasBeenPlaced(cp),
});
export const setWavelength = (cp, wavelength) => {
    cp.wavelength = parseInt(wavelength);
    setPlacement(cp, null);
};

export const setPlacementStatus = (cp, beingPlaced) => {
    cp.isBeingPlaced = beingPlaced;
};

export const setPlacement = (cp, x) => {
    cp.placement = x;
};

export const wavelengthIsValid = (cp) =>
    !isNaN(cp.wavelength) &&
    cp.wavelength >= MINIMUM_WAVELENGTH &&
    cp.wavelength <= MAXIMUM_WAVELENGTH;

export const wavelengthIsEmpty = (cp) => cp.wavelength === '' || !cp.wavelength;

export const isValidToPlace = (cp) => wavelengthIsValid(cp);

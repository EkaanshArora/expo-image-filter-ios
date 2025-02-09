// Reexport the native module. On web, it will be resolved to ExpoImageFilterModule.web.ts
// and on native platforms to ExpoImageFilterModule.ts
// export { default } from './ExpoImageFilterModule';
import { SharedRef } from 'expo-modules-core/types';
import ExpoImageFilterModule from './ExpoImageFilterModule'
import { HexColor, FilterPropertyValue } from './ExpoImageFilter.types';

const ApplyCIFilterToImageAndReturnBase64 = ExpoImageFilterModule.ApplyCIFilterToImageAndReturnBase64;
/**
 * Get the base64 image data from the output image
 * @param outputImage - The output image to get the base64 data from
 * @returns The base64 image data   
 * @example
 * const outputImageRes = await outputImage(nativeFilter)
 * const base64Image = await base64ImageData(outputImageRes)
 */
const base64ImageData = ExpoImageFilterModule.base64ImageData
/**
 * Create a CIFilter
 * @param filterName - The name of the filter to create
 * @returns The created CIFilter
 * @example
 * const nativeFilter = await createCIFilter("CIColorMonochrome")
 */
const createCIFilter = ExpoImageFilterModule.createCIFilter
/**
 * Log the shared ref
 */
const logSharedRef = ExpoImageFilterModule.logSharedRef
/**
 * Get the output image from the CIFilter
 * @param nativeFilter - The native filter to get the output image from
 * @returns The output image
 * @example
 * const nativeFilter = await createCIFilter("CIColorMonochrome")
 * const outputImageRes = await outputImage(nativeFilter)
 */
const outputImage = ExpoImageFilterModule.outputImage
/**
 * Set the value of the CIFilter
 * @param nativeFilter - The native filter to set the value on
 * @param key - The key to set the value on
 * @param value - The value to set on the native filter
 * @example
 * const nativeFilter = await createCIFilter("CIColorMonochrome")
 * await setValue(nativeFilter, "inputIntensity", 1)
 */
const setValue = ExpoImageFilterModule.setValue
/**
 * Set the value of the CIFilter from an image
 * @param nativeFilter - The native filter to set the value on
 * @param value - The value to set on the native filter
 * @param key - The key to set the value on
 */
const setValueImage = ExpoImageFilterModule.setValueImage

/**
 * Infer the type of the value and set it on the native filter
 * @param nativeFilter - The native filter to set the value on
 * @param key - The key to set the value on
 * @param value - The value to set on the native filter
 * @example 
 * const nativeFilter = await createCIFilter("CIColorMonochrome")
 * await inferTypeAndSetValue(nativeFilter, "inputIntensity", 1)
 * await inferTypeAndSetValue(nativeFilter, "inputColor", "#ff00ffff")
 * await inferTypeAndSetValue(nativeFilter, "inputImage", image)
 * const outputImageRes = await outputImage(nativeFilter)
 * const base64Image = await base64ImageData(outputImageRes)
 */
const inferTypeAndSetValue = async <T extends string>(
    nativeFilter: SharedRef<'CIFilter'>,
    key: T,
    value:
        T extends "inputColor" ? HexColor :
        T extends "inputImage" ? SharedRef<'image'> :
        FilterPropertyValue) => {
    if (typeof value === 'object' && 'x' in value && 'y' in value) {
        return await setValue(nativeFilter, { type: 'cgPoint', stringValue: `${value.x},${value.y}` }, key);
    } else if (typeof value === 'object' && 'height' in value && 'width' in value) {
        return await setValueImage(nativeFilter, value, key);
    } else if (typeof value === 'string') {
        if (value.startsWith('#')) {
            if (value.length === 9) {
                return await setValue(nativeFilter, { type: 'ciColor', stringValue: value }, key);
            } else if (value.length === 7) {
                return await setValue(nativeFilter, { type: 'ciColor', stringValue: `${value}ff` }, key);
            } else {
                throw new Error('Invalid hex color');
            }
        } else {
            return await setValue(nativeFilter, { type: 'string', stringValue: value }, key);
        }
    } else if (typeof value === 'number') {
        // there's probably a way to send native value and infer the type on swift side but this works for now
        return await setValue(nativeFilter, { type: 'number', stringValue: value.toString() }, key);
    } else if (typeof value === 'boolean') {
        return await setValue(nativeFilter, { type: 'boolean', stringValue: value.toString() }, key);
    }
    console.log("value", value, typeof value)
    throw new Error('Invalid value type');
}

export {
    ApplyCIFilterToImageAndReturnBase64,
    base64ImageData,
    createCIFilter,
    logSharedRef,
    outputImage,
    setValue,
    setValueImage,
    inferTypeAndSetValue,
}

export * from './ExpoImageFilter.types';

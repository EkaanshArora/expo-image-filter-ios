// Reexport the native module. On web, it will be resolved to ExpoImageFilterModule.web.ts
// and on native platforms to ExpoImageFilterModule.ts
import type { SharedRef } from 'expo-modules-core/types';
import ExpoImageFilterModule from './ExpoImageFilterModule'
import type { FilterPropertyValue } from './ExpoImageFilter.types';

const setValue = ExpoImageFilterModule.setValue
const setValueImage = ExpoImageFilterModule.setValueImage
/**
 * Get the base64 image data from the output image
 * @param outputImage - The output image to get the base64 data from
 * @returns The base64 image data   
 * @example
 * const outputImageRes = await outputImage(nativeFilter)
 * const base64Image = await base64ImageData(outputImageRes)
 */
const createBase64FromImage = ExpoImageFilterModule.createBase64FromImage
/**
 * Create a CIFilter
 * @param filterName - The name of the filter to create
 * @returns The created CIFilter
 * @example
 * const nativeFilter = await createCIFilter("CIColorMonochrome")
 */
const createCIFilter = ExpoImageFilterModule.createCIFilter
/**
 * Create an image from a base64 string
 * @param base64 - The base64 string to create the image from, do not include the `data:image/jpeg;base64,` in your string
 * @returns SharedRef<'UIImageInput'> | undefined;
 * @example
 * const image = await createImageFromBase64("/9j/4AAQSkZJRgA.....")
 */
const createImageFromBase64 = (base64: string) => ExpoImageFilterModule.createImageFromBase64(base64)

/**
 * Get the output image from the CIFilter
 * @param nativeFilter - The native filter to get the output image from
 * @param cropToInputImage - (Optional) Whether to crop the output image to the input image. This is useful when the resulting flter generates an image that's larger than the input image. Default: `false`.
 * @returns The output image
 * @example
 * const nativeFilter = await createCIFilter("CIColorMonochrome")
 * const outputImageRes = await outputImage(nativeFilter)
 */
const getOutputImage = (nativeFilter: SharedRef<'CIFilter'>, cropToInputImage?: boolean) => ExpoImageFilterModule.getOutputImage(nativeFilter, cropToInputImage ?? false)
/**
 * Set value on the native filter
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
const setFilterValue = async <FilterPropertyKey extends string>(
    nativeFilter: SharedRef<'CIFilter'>,
    key: FilterPropertyKey,
    value: FilterPropertyValue<FilterPropertyKey>) => {
    if (typeof value === 'object' && 'x' in value && 'y' in value) {
        return await setValue(nativeFilter, { type: 'cgPoint', stringValue: `${value.x},${value.y}` }, key);
    }

    if (typeof value === 'object' && ["image", "UIImageInput"].includes(value.nativeRefType)) {
        return await setValueImage(nativeFilter, value, key);
    }

    if (typeof value === 'string') {
        if (value.startsWith('#')) {
            if (value.length === 9) {
                return await setValue(nativeFilter, { type: 'ciColor', stringValue: value }, key);
            }
            if (value.length === 7) {
                return await setValue(nativeFilter, { type: 'ciColor', stringValue: `${value}ff` }, key);
            }
            throw new Error(`Invalid hex color: ${value}`);
        }
        return await setValue(nativeFilter, { type: 'string', stringValue: value }, key);
    }

    if (typeof value === 'number') {
        // there's probably a way to send native value and infer the type on swift side but this works for now
        return await setValue(nativeFilter, { type: 'number', stringValue: value.toString() }, key);
    }

    if (typeof value === 'boolean') {
        return await setValue(nativeFilter, { type: 'boolean', stringValue: value.toString() }, key);
    }

    throw new Error(`Invalid value type: ${typeof value}`);
}

export {
    createImageFromBase64,
    createBase64FromImage,
    createCIFilter,
    getOutputImage,
    setFilterValue,
}

export * from './ExpoImageFilter.types';

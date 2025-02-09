// Reexport the native module. On web, it will be resolved to ExpoImageFilterModule.web.ts
// and on native platforms to ExpoImageFilterModule.ts
// export { default } from './ExpoImageFilterModule';
import { SharedRef } from 'expo-modules-core/types';
import ExpoImageFilterModule from './ExpoImageFilterModule'

const ApplyCIFilterToImageAndReturnBase64 = ExpoImageFilterModule.ApplyCIFilterToImageAndReturnBase64;
const base64ImageData = ExpoImageFilterModule.base64ImageData
const createCIFilter = ExpoImageFilterModule.createCIFilter
const logSharedRef = ExpoImageFilterModule.logSharedRef
const outputImage = ExpoImageFilterModule.outputImage
const setValue = ExpoImageFilterModule.setValue
const setValueImage = ExpoImageFilterModule.setValueImage
type HexColor = `#${string & { length: 8 }}`;

const inferTypeAndSetValue = async (nativeFilter: SharedRef<'CIFilter'>, key: string, value: string | number | boolean | HexColor | SharedRef<'image'>) => {
    if (typeof value === 'object' && 'height' in value && 'width' in value) {
        return await setValueImage(nativeFilter, value, key);
    } else if (typeof value === 'string') {
        if (value.startsWith('#')) {
            return await setValue(nativeFilter, { type: 'ciColor', stringValue: value }, key);
        } else {
            return await setValue(nativeFilter, { type: 'string', stringValue: value }, key);
        }
    } else if (typeof value === 'number') {
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

// export { default as ExpoImageFilterView } from './ExpoImageFilterView';
export * from './ExpoImageFilter.types';

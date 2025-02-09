import CoreImage
import CoreImage.CIFilterBuiltins
import ExpoModulesCore
import UIKit

enum DictValsStringValue: String, Enumerable {
    case string
    case number
    case boolean
    case ciColor
    case cgPoint
}

struct DictVals: Record {
    @Field
    var stringValue: String = "string"

    @Field
    var type: DictValsStringValue = .string
}

public final class FilterRef: SharedRef<CIFilter> {
    override public var nativeRefType: String {
        "CIFilter"
    }

    func printName() -> String {
        return ref.name
    }
    var coreImageKeys = [String: String]()

    func getCoreImageKeys() -> [String: String] {
        if coreImageKeys.isEmpty {
            var keys = [String: String]()
            let attributes = ref.attributes
            
        for (key, value) in attributes {
            if let attributeDict = value as? [String: Any],
               let attributeClass = attributeDict[kCIAttributeClass] as? String
            {
                    keys[key] = attributeClass
                }
            }
            coreImageKeys = keys
        }
        return coreImageKeys
    }
}

public final class ImageRef: SharedRef<UIImage> {
    override public var nativeRefType: String {
        "UIImageInput"
    }
}

public final class OutputImageRef: SharedRef<UIImage> {
    override public var nativeRefType: String {
        "UIImageOutput"
    }
}

public class ExpoImageFilterModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoImageFilter')` in JavaScript.
        Name("ExpoImageFilter")

        Function("createCIFilter") { (filterName: String) in
            print("filterName", filterName)
            let filter = CIFilter(name: filterName)
            let filterRef = FilterRef(filter!)
            print("Created filterRef:", filterRef)
            print("coreImageKeys", filterRef.getCoreImageKeys())
            return filterRef
        }

        AsyncFunction("logSharedRef") { (filterRef: FilterRef?, promise: Promise) in
            if let filter = filterRef {
                print("logSharedRef - filter:", filter)
                print("logSharedRef - filter name:", filter.ref.name)
                return promise.resolve(true)
            } else {
                print("logSharedRef - received nil filter reference")
                return promise.resolve(true)
            }
        }

        AsyncFunction("setValue") { (FilterRef: FilterRef, value: DictVals, forKey: String, promise: Promise) in
            print("setValue")
            print("DictVals", value.type)
            if !checkKeyForFilter(filter: FilterRef, key: forKey) {
                print("Failed to check key", forKey, FilterRef.ref.name)
                promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to check key \(forKey) for filter \(FilterRef.ref.name). Available keys: \(FilterRef.getCoreImageKeys().values)"]))
                return
            }
            switch value.type {
            case .number:
                print("number", value.stringValue)
                guard let floatValue = Float(value.stringValue) else {
                    promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to convert number"]))
                    return
                }
                FilterRef.ref.setValue(floatValue, forKey: forKey)
            case .cgPoint:
                print("CGPoint", value.stringValue)
                let components = value.stringValue.split(separator: ",")
                guard let x = Double(components[0]), let y = Double(components[1]) else {
                    promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to convert CGPoint"]))
                    return
                }
                // CGPoint doesn't work here, idk man this is a mess
                let cgPoint = CIVector(x: x, y: y)
                print("cgPoint", cgPoint)
                FilterRef.ref.setValue(cgPoint, forKey: forKey)
            case .ciColor:
                print("CIColor", value.stringValue)
                guard let color = UIColor(hex: value.stringValue) else {
                    promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to convert color"]))
                    return
                }
                print("color", color)
                let colorValue = CIColor(color: color)
                print("colorValue", colorValue)
                FilterRef.ref.setValue(colorValue, forKey: forKey)
            case .boolean:
                print("boolean", value.stringValue)
                guard let booleanValue = Bool(value.stringValue) else {
                    promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to convert boolean"]))
                    return
                }
                FilterRef.ref.setValue(booleanValue, forKey: forKey)
            case .string:
                print("stringValue", value.stringValue)
                let stringValue = value.stringValue
                FilterRef.ref.setValue(stringValue, forKey: forKey)
            default:
                print("Unknown type")
                promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to match type"]))
                return
            }

            print("FilterRef", FilterRef)
            print("value", value)
            print("forKey", forKey)

            promise.resolve(true)
        }

        AsyncFunction("setValueImage") { (FilterRef: FilterRef, value: SharedRef<UIImage>, forKey: String, promise: Promise) in
            print("setValueImage")
            print("value", value)
            print("forKey", forKey)
            let image: SharedRef<UIImage> = value
            print("image", image)
            if let ciImage = CIImage(image: image.ref) {
                print("ciImage value", ciImage)
                print("kCIInputImageKey", kCIInputImageKey)
                print("forKey", forKey)
                FilterRef.ref.setValue(ciImage, forKey: forKey)
                return promise.resolve(true)
            }
            return promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to get output image1"]))
        }

        Function("outputImage") { (FilterRef: FilterRef, cropToInputImage: Bool) in
            print("outputImage")
            print("Filter name:", FilterRef.ref.name)
            print("Current input values:")
            for key in FilterRef.ref.inputKeys {
                print("\(key):", FilterRef.ref.value(forKey: key) as Any)
            }
            
            guard let ciImage = FilterRef.ref.outputImage else {
                print("Failed to get output image. Filter name:", FilterRef.ref.name)
                print("Available keys:", FilterRef.getCoreImageKeys())
                print("Current values:", FilterRef.ref.inputKeys)
                throw NSError(domain: "ExpoImageFilter", 
                             code: 7, 
                             userInfo: [NSLocalizedDescriptionKey: "Failed to get output image from filter \(FilterRef.ref.name). Make sure all required parameters are set."])
            }
            print("output done, trying uiimage")
            if cropToInputImage {
                // input image extent
                print("inputImage from filter", FilterRef.ref.value(forKey: kCIInputImageKey) as Any)
                let inputImage = FilterRef.ref.value(forKey: kCIInputImageKey) as? CIImage
                let origImage = inputImage?.extent ?? CGRect(x: 0, y: 0, width: 0, height: 0)
                let croppedImage = ciImage.cropped(to: origImage)
                let uiImage = UIImage(ciImage: croppedImage)
                print("uiImage cropped", uiImage)
                return OutputImageRef(uiImage)
            } else {
                let uiImage = UIImage(ciImage: ciImage)
                print("uiImage", uiImage)
                return OutputImageRef(uiImage)
            }
        }

        AsyncFunction("base64ImageData") { (OutputImage: OutputImageRef, promise: Promise) in
            print("OutputImage", OutputImage)
            if let imageData = OutputImage.ref.pngData() {
                let strBase64 = imageData.base64EncodedString(options: .lineLength64Characters)
                return promise.resolve(strBase64)
            }
            return promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to get output image4"]))
        }

        AsyncFunction("ApplyCIFilterToImageAndReturnBase64") { (image: SharedRef<UIImage>, filterName: String, filterValues: [String: Any], promise: Promise) in
            guard let ciImage = CIImage(image: image.ref) else {
                promise.reject(NSError(domain: "ExpoImageFilter", code: 1, userInfo: [NSLocalizedDescriptionKey: "Image is nil"]))
                return
            }
            print(ciImage)
            guard let nativeFilter = CIFilter(name: filterName) else {
                promise.reject(NSError(domain: "ExpoImageFilter", code: 2, userInfo: [NSLocalizedDescriptionKey: "Filter not found"]))
                return
            }
            print(nativeFilter)

            // Set all filter values
            for (key, value) in filterValues {
                if key != "filter" { // Skip the filter name
                    if let imageRef = value as? SharedRef<UIImage> {
                        if let inputCIImage = CIImage(image: imageRef.ref) {
                            nativeFilter.setValue(inputCIImage, forKey: key)
                        }
                    } else if let stringValue = value as? String {
                        nativeFilter.setValue(stringValue, forKey: key)
                    }
                }
            }

            nativeFilter.setValue(ciImage, forKey: kCIInputImageKey)

            if let outputImage = nativeFilter.outputImage {
                print("outputImage")
                print(outputImage)
                let uiImage = UIImage(ciImage: outputImage)
                if let imageData = uiImage.pngData() {
                    let strBase64 = imageData.base64EncodedString(options: .lineLength64Characters)
                    print(strBase64)
                    promise.resolve(strBase64)
                } else {
                    promise.reject(NSError(domain: "ExpoImageFilter", code: 4, userInfo: [NSLocalizedDescriptionKey: "Failed to convert image to PNG data"]))
                }
            } else {
                promise.reject(NSError(domain: "ExpoImageFilter", code: 3, userInfo: [NSLocalizedDescriptionKey: "Failed to apply filter"]))
            }
        }
    }
    public func checkKeyForFilter(filter: FilterRef, key: String) -> Bool {
        let coreImageKeys = filter.getCoreImageKeys()
        if coreImageKeys.keys.contains(key) {
            return true
        }
            return false
    }
}

extension UIColor {
    public convenience init?(hex: String) {
        let r, g, b, a: CGFloat

        if hex.hasPrefix("#") {
            let start = hex.index(hex.startIndex, offsetBy: 1)
            let hexColor = String(hex[start...])

            if hexColor.count == 8 {
                let scanner = Scanner(string: hexColor)
                var hexNumber: UInt64 = 0

                if scanner.scanHexInt64(&hexNumber) {
                    r = CGFloat((hexNumber & 0xff000000) >> 24) / 255
                    g = CGFloat((hexNumber & 0x00ff0000) >> 16) / 255
                    b = CGFloat((hexNumber & 0x0000ff00) >> 8) / 255
                    a = CGFloat(hexNumber & 0x000000ff) / 255

                    self.init(red: r, green: g, blue: b, alpha: a)
                    return
                }
            }
        }

        return nil
    }
}

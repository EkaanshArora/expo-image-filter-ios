import CoreImage
import CoreImage.CIFilterBuiltins
import ExpoModulesCore
import UIKit

public final class FilterRef: SharedRef<CIFilter> {
    public override var nativeRefType: String {
    "CIFilter"
  }

  func printName() -> String {
      return self.ref.name
  }
}

public final class OutputImageRef: SharedRef<UIImage> {
    public override var nativeRefType: String {
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
            
            let coreImageKeys: [String: String] = {
                var keys = [String: String]()
                let filter = CIFilter(name: filter!.name)
                let attributes = filter?.attributes ?? [:]
                
                for (key, value) in attributes {
                    if let attributeDict = value as? [String: Any],
                       let attributeClass = attributeDict[kCIAttributeClass] as? String {
                        keys[attributeClass] = key
                    }
                }
                return keys
            }()
            print("coreImageKeys", coreImageKeys)
            
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

        
        AsyncFunction("setValue") { (FilterRef: FilterRef, value: Either<String, SharedRef<UIImage>>, forKey: String, promise: Promise) in
            print("setValue")
            if let url: String = value.get() {
                print("url", url)
                if let floatValue = Float(url) {
                  print("floatValue", floatValue)
                    FilterRef.ref.setValue(floatValue, forKey: forKey)
                } else {
                    return promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to convert string to float"]))
                }
                return promise.resolve(true)
            }

            print("FilterRef",FilterRef)
            print("value", value)
            print("forKey", forKey)
            
            if let image: SharedRef<UIImage> = value.get() {
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
            return promise.reject(NSError(domain: "ExpoImageFilter", code: 6, userInfo: [NSLocalizedDescriptionKey: "Failed to get output image2"]))
        }

        Function("outputImage") { (FilterRef: FilterRef) in
            print("outputImage")
            print(FilterRef)
            guard let ciImage = FilterRef.ref.outputImage else {
                print("outputImage is nil")
                return OutputImageRef(UIImage())
            }
            let uiImage = UIImage(ciImage: ciImage)
            print("uiImage", uiImage)
            return OutputImageRef(uiImage)
        }

        AsyncFunction("base64ImageData") { (OutputImage: OutputImageRef, promise: Promise) in
            print("OutputImage", OutputImage)
            if let imageData = OutputImage.ref.pngData() {
                print("imageData", imageData)
                let strBase64 = imageData.base64EncodedString(options: .lineLength64Characters)
                print(strBase64)
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
}

import CoreImage
import CoreImage.CIFilterBuiltins
import ExpoModulesCore
import UIKit

@objcMembers
public final class FilterRef: SharedRef<CIFilter> {
    public override var nativeRefType: String {
    "CIFilter"
  }

  func printName() -> String {
    return ref.name
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

        // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
        Constants([
            "PI": Double.pi,
        ])

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
        Function("hello") {
            "Hello world! 👋"
        }

        // Defines a JavaScript function that always returns a Promise and whose native code
        // is by default dispatched on the different thread than the JavaScript runtime runs on.
        AsyncFunction("setValueAsync") { (value: String) in
            // Send an event to JavaScript.
            self.sendEvent("onChange", [
                "value": value,
            ])
        }

        AsyncFunction("createCIFilter") { (filterName: String, promise: Promise) in
            print("filterName", filterName)
            
            guard let filter = CIFilter(name: filterName) else {
                // If the filter fails to be created, resolve with `nil`.
                print("Unable to create filter with name:", filterName)
                return promise.resolve(nil)
            }
            
            // Wrap the native filter in your specialized `FilterRef`
            let filterRef = FilterRef(filter)
            print("Created filterRef:", filterRef)
            
            return promise.resolve(filterRef)
        }

        AsyncFunction("logSharedRef") { (filterRef: FilterRef?, promise: Promise) in
            if let filter = filterRef {
                print("logSharedRef - filter:", filter)
                print("logSharedRef - filter name:", filter.ref.name)
            } else {
                print("logSharedRef - received nil filter reference")
            }
        }

        AsyncFunction("setValue") { (FilterRef: FilterRef, value: Either<String, SharedRef<UIImage>>, forKey: String, promise: Promise) in
            print("setValue")
            print("FilterRef", FilterRef)
            if let url: String = value.get() {
                FilterRef.ref.setValue(url, forKey: forKey)
            }
            if let image: SharedRef<UIImage> = value.get() {
                if let ciImage = CIImage(image: image.ref) {
                    FilterRef.ref.setValue(ciImage, forKey: forKey)
                }
            }
        }

        AsyncFunction("outputImage") { (FilterRef: FilterRef, promise: Promise) in
            print(FilterRef)
            guard let ciImage = FilterRef.ref.outputImage else {
                let emptyImage = UIImage()
                return promise.resolve(SharedRef(emptyImage))
            }
            let uiImage = UIImage(ciImage: ciImage)
            return promise.resolve(SharedRef(uiImage))
        }

        AsyncFunction("base64ImageData") { (Image: SharedRef<UIImage>, promise: Promise) in
            if let imageData = Image.ref.pngData() {
                let strBase64 = imageData.base64EncodedString(options: .lineLength64Characters)
                print(strBase64)
                return promise.resolve(strBase64)
            }
            return promise.resolve("")
        }

//        AsyncFunction("applyFilter") { (image: SharedRef<UIImage>, filter: String, promise: Promise) in
//            guard let ciImage = CIImage(image: image.ref) else {
//                promise.reject(NSError(domain: "ExpoImageFilter", code: 1, userInfo: [NSLocalizedDescriptionKey: "Image is nil"]))
//                return
//            }
//            print(ciImage)
//            guard let nativeFilter = CIFilter(name: filter) else {
//                promise.reject(NSError(domain: "ExpoImageFilter", code: 2, userInfo: [NSLocalizedDescriptionKey: "Filter not found"]))
//                return
//            }
//            print(nativeFilter)
//            nativeFilter.setValue(ciImage, forKey: kCIInputImageKey)
//            if let outputImage = nativeFilter.outputImage {
//                print("outputImage")
//                print(outputImage)
//                let uiImage = UIImage(ciImage: outputImage)
//                if let imageData = uiImage.pngData() {
//                    let strBase64 = imageData.base64EncodedString(options: .lineLength64Characters)
//                    print(strBase64)
//                    promise.resolve([outputImage, strBase64])
//                } else {
//                    promise.reject(NSError(domain: "ExpoImageFilter", code: 4, userInfo: [NSLocalizedDescriptionKey: "Failed to convert image to PNG data"]))
//                }
//            } else {
//                promise.reject(NSError(domain: "ExpoImageFilter", code: 3, userInfo: [NSLocalizedDescriptionKey: "Failed to apply filter"]))
//            }
//        }
  
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

        // Enables the module to be used as a native view. Definition components that are accepted as part of the
        // view definition: Prop, Events.
        // View(ExpoImageFilterView.self) {
        //   // Defines a setter for the `url` prop.
        //   Prop("url") { (view: ExpoImageFilterView, url: URL) in
        //     if view.webView.url != url {
        //       view.webView.load(URLRequest(url: url))
        //     }
        //   }

        //   Events("onLoad")
        // }
    }
}

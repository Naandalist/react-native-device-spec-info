require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNDeviceSpecDetector"
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']
  s.authors      = package['author']
  s.homepage     = package['repository']['url']
  s.platforms    = { :ios => "11.0" }

  s.source       = { :git => package['repository']['url'], :tag => "v#{s.version}" }
  s.source_files = "ios/RNDeviceSpecDetector/**/*.{h,m}"

  s.dependency 'React-Core'
end

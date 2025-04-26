
$env:JAVA_HOME = "c:\Users\DELL\.jdks\openjdk-17.0.2"
$env:ANDROID_HOME = "c:\Users\DELL\AppData\Local\Android\Sdk" 
cd android
.\gradlew clean
.\gradlew assembleDebug

npx cap open android

$env:JAVA_HOME = "c:\Users\DELL\.jdks\openjdk-17.0.2"
$env:ANDROID_HOME = "c:\Users\DELL\AppData\Local\Android\Sdk" 
cd android
.\gradlew clean
.\gradlew assembleDebug

npm install
npm run buid
npx cap sync android
npx cap open android


npm i -g @ionic/cli
ionic serve

cd .../LOCSS_Project
ionic cordova build --release android
cp .../LOCSS_Project/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk .
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks app-release-unsigned.apk my-alias
zipalign -v 4 app-release-unsigned.apk LOCSS.apk
apksigner verify LOCSS.apk

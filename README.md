# BlindBit Spend

The mobile app which neatly integrates with BlindBit Scan. It enables you to connect to your scanning instance, load the found utxos and then spend them easily within the App.

> [!CAUTION]
> This app is not extensively tested. It has worked for some simple sending but you should verify yourself that it works as you would exepct. The status of this app is not even early alpha yet. So as I said, use with caution.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

    To run on a physical iOS device 
   ```bash
    npx expo run:ios --configuration Release --device
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## Setting up in the App

The app currently does not create new seed words. Those have to be generated outside the app. The devtools in [blindbitd](https://github.com/setavenger/blindbitd) can be used to extract the public spend key and the scan secret key for BlindBit Scan.


## Todos

- [ ] Generate new seed words inside app
- [ ] Show keys required for BlindBit Scan (spend public key + scan secret key)

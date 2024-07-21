import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const writeFileAndExportToAndroidDestination = async ({
  filename,
  contents,
  destinationLocalizedString,
  destination,
}) => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Access Permission',
      message:
        'BlindBit needs your permission to access your storage to save this file.',
      buttonNeutral: 'Ask me later',
      buttonNegative: 'Cancel',
      buttonPositive: 'Ok',
    },
  );
  if (
    granted === PermissionsAndroid.RESULTS.GRANTED ||
    Platform.Version >= 33
  ) {
    const filePath = destination + `/${filename}`;
    try {
      await RNFS.writeFile(filePath, contents);
      Alert.alert(`File ${filePath} has been saved in your ${destination}.`);
    } catch (e) {
      console.log(e);
      Alert.alert(e.message);
    }
  } else {
    console.log('Storage Permission: Denied');
    Alert.alert(
      'Storage Access Permission',
      'BlindBit is unable to save this file. Please open your device settings and enable Storage Permission.',
      [
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings();
          },
          style: 'default',
        },
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      ],
    );
  }
};

export const writeFileAndExport = async function (filename, contents) {
  if (Platform.OS === 'ios') {
    const filePath = RNFS.TemporaryDirectoryPath + `/${filename}`;
    await RNFS.writeFile(filePath, contents);
    await Share.open({
      url: 'file://' + filePath,
      saveToFiles: false,
    })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        RNFS.unlink(filePath);
      });
  } else if (Platform.OS === 'android') {
    await writeFileAndExportToAndroidDestination({
      filename,
      contents,
      destinationLocalizedString: 'Downloads Folder',
      destination: RNFS.DownloadDirectoryPath,
    });
  }
};

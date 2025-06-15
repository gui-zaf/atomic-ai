import { ActionSheetIOS, Platform } from "react-native";

interface ImageActionSheetProps {
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
}

export const showImageActionSheet = ({
  onLike,
  onShare,
  onDownload,
}: ImageActionSheetProps) => {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Like", "Share", "Download", "Cancel"],
        cancelButtonIndex: 3,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            onLike();
            break;
          case 1:
            onShare();
            break;
          case 2:
            onDownload();
            break;
        }
      },
    );
  } else {
    // For Android, we'll implement this later if needed
  }
};

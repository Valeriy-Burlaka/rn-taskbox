import { View } from "react-native";
import { withBackgrounds } from "@storybook/addon-ondevice-backgrounds";

// const withCentering = (Story) => (
//   <View
//     style={{
//       borderColor: 'coral',
//       borderStyle: 'solid',
//       borderWidth: 1,
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}
//   >
//     <Story />
//   </View>
// );

export const decorators = [
  withBackgrounds,
  // withCentering
];

export const parameters = {
  backgrounds: [
    { name: "plain", value: "white", default: true },
    { name: "warm", value: "hotpink" },
    { name: "cool", value: "deepskyblue" },
  ],
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

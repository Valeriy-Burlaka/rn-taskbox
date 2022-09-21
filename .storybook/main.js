module.exports = {
  stories: [
    "../app/components/**/*.stories.mdx",
    "../app/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-actions",
    "@storybook/addon-controls",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-react-native-web"
  ],
  framework: "@storybook/react",
};

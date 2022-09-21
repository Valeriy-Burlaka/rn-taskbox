# Welcome

## Description

Testing the rn-expo template with Storybook (*SB*) React Native (tutorial)[https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/]. 

The default setup `expo init --template tabs@sdk-46` && then `sb init --type react_native` produces a broken SB build, so I wanted to trial my custom template.

## Knowledge Base

### Common Issues

#### Hot-reload not working (or always showing a previous change)

Hot reload doesn't work properly in the root `App.js` component. Converting the `App.js` to a _class_ component may help (see https://github.com/expo/expo/issues/4957).
Try adding a change in a _child_ component to see if hot reloading is working for you.

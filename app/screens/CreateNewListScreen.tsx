import { useMemo, useState } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { rgba } from 'polished';

import { FontelloIcon, glyphMap as fontelloGlyphMap } from 'constants/Fontello';
import { spacings } from 'constants/Spacings';
import { type RootStackScreenProps } from 'types/navigation';
import { SCREEN_WIDTH } from 'utils/dimensions';

const OuterContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.2)};
  flex: 1;
  padding: ${spacings.space100};
`;

const ModalHeader = styled.View<{}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  /* border: 1px solid red; */
  margin-bottom: ${spacings.space200};
`;

const CloseButton = styled.TouchableOpacity<{ backgroundColor: string }>`
  border-radius: 100px;
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.2)};
  color: black;
  padding: 2px;
`;

const StyledTextInput = styled.TextInput`
  background-color: white;
  border-radius: ${spacings.space50};
  height: ${spacings.space300};
  margin-bottom: ${spacings.space300};
  text-align: center;
`;

const PaletteContainer = styled.View`
  background-color: white;
  border-radius: ${spacings.space50};
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${spacings.space200};
  padding: ${spacings.space50};
`;

const IconContainer = styled(PaletteContainer)``;

const PaletteItem = styled.TouchableOpacity<{
  backgroundColor: string;
  size: string;
  selected?: boolean
}>
`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 100px;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  margin: ${spacings.space50};

  /* Not the view I'm looking for.
    Basically, I want to render a solid border around a selected palette item, not a blurry shadow.
    Will need to apply some hack, like rendering a wrapper View around.
  */
  shadow-color: ${({ selected }) => selected ? 'black' : undefined};
  shadow-offset: ${({ selected }) => selected ? '0px 0px' : undefined};
  shadow-opacity: ${({ selected }) => selected ? '1' : undefined};
  shadow-radius: ${({ selected }) => selected ? '3px' : undefined};
  /* https://github.com/styled-components/styled-components/issues/709 */
  /* Elevation is a workaround for Android. Shadow don't work on Android */
  /* elevation: 0; */

  /* Doesn't allow 4th parameter (spread radius) */
  /* box-shadow: 0px 0px 10px grey; */

  /* Doesn't work for me - borders are rendered inside (inward) the View */
  /* border-color: lightgrey;
  border-style: dotted;
  border-width: 5px; */
`;

const IconItem = styled.TouchableOpacity<{
  backgroundColor: string;
  size: string;
  selected?: boolean
}>
`
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.1)};
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  margin: ${spacings.space50};
`;

// https://www.w3schools.com/tags/ref_colornames.asp
export const palette = [
  // 1st row
  '#32CD32', // LimeGreen
  '#F08080', // LightCoral
  '#F4A460', // SandyBrown
  '#DAA520', // GoldenRod
  '#ADD8E6', // LightBlue
  '#87CEFA', // LightSkyBlue
  // 2nd row
  '#8A2BE2', // BlueViolet
  '#FFB6C1', // LightPink
  '#696969', // DimGray
  '#ADFF2F', // GreenYellow
  '#FF4500', // OrangeRed
  '#FFA500', // Orange
  // 3rd row
  '#FFD700', // Gold
  '#87CEEB', // SkyBlue
  '#4682B4', // SteelBlue
  '#800080', // Purple
  '#DC143C', // Crimson
  '#B8860B', // DarkGoldenRod
];

const getItemSizeOnScreen = (numItemsPerRow: number, itemPadding: number): number => {
  const itemSize = Math.floor(
    (
      SCREEN_WIDTH
        - (itemPadding * 2)
        - (itemPadding * (numItemsPerRow + 1))
    )
      / numItemsPerRow
  );
  console.log(`Calculated size of palette item for screen width=${SCREEN_WIDTH}px : ${itemSize}px`);

  return itemSize;
};

const getNumberAsPixels = (size: number): string => {
  return `${size}px`;
};

const getPixelsAsNumber = (pixels: string): number => {
  return Number(spacings.space100.replace('px', ''));
};

const glyphsInOrder: Array<keyof typeof fontelloGlyphMap> = [
  'list-bullet',
  'shopping-cart',
  'home',
  'heart-empty',
  'calendar',
  'star-empty',
  'music',
  'graduation-cap',
  'flight',
  'wrench',
  'bicycle',
  'bed',
  'money',
  'gamepad',
  'subway',
  'paw',
  'user',
  'chat-empty',
  'television',
  'soccer-ball',
  'mail',
  'beaker',
  'coffee',
  'gift',
  'heartbeat',
  'building',
  'sun',
  'moon',
  'map-o',
  'medkit',
  'stethoscope',
  'diamond',
  'dollar',
  'bookmark-empty',
  'trash-empty',
  'attach',
];

export function CreateNewListScreen({ navigation }: RootStackScreenProps<'CreateNewListScreen'>) {
  const [activeColor, setActiveColor] = useState(palette[0]);
  const [activeIcon, setActiveIcon] = useState(glyphsInOrder[0]);
  const [listTitle, setListTitle] = useState('');

  const selectableItemsPerRow = 6;
  const selectableItemSize = useMemo(() => {
    return getItemSizeOnScreen(
      selectableItemsPerRow,
      getPixelsAsNumber(spacings.space100)
    );
  }, [selectableItemsPerRow]);

  return (
    <OuterContainer backgroundColor={activeColor}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      {/* fixme: the header shouldn't be scrollable */}
      <ModalHeader>
        <CloseButton
          backgroundColor={'#696969'}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={20} color={'#696969'} />
        </CloseButton>
        <FontelloIcon
          name={activeIcon}
          color={activeColor}
          size={selectableItemSize * 0.9}
        />
        <TouchableOpacity>
          <Text>
            Save
          </Text>
        </TouchableOpacity>
      </ModalHeader>

      <StyledTextInput
        selectionColor={activeColor}
        value={listTitle}
        onChangeText={setListTitle}
      />

      <PaletteContainer>
        {palette.map((color, index) => {
          return (
            <PaletteItem
              activeOpacity={1}
              backgroundColor={color}
              key={index}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveColor(color);
              }}
              selected={color === activeColor}
              size={getNumberAsPixels(selectableItemSize)}
            />
          );
        })}
      </PaletteContainer>

      <IconContainer>
        {glyphsInOrder.map((glyphName, id) => {
          const isActive = glyphName === activeIcon;

          return (
            <IconItem
              activeOpacity={1}
              backgroundColor={isActive ? activeColor : 'white'}
              size={getNumberAsPixels(selectableItemSize)}
              key={id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveIcon(glyphName);
              }}
            >
              <FontelloIcon
                name={glyphName}
                color={isActive ? activeColor : 'grey'}
                size={28} // ?? how it relates with the calculated item size?? (fixme!)
              />
            </IconItem>
          );
        })}
      </IconContainer>
    </OuterContainer>
  );
}

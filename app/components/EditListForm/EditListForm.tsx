import { useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { rgba } from 'polished';

import { FontelloIcon, type GlyphIcon } from 'constants/Fontello';
import { TaskListUpdate } from 'types';
import { SCREEN_WIDTH } from 'utils/dimensions';

import { palette, type PaletteColor } from 'theme/Colors';
import { spacings } from 'theme/Spacings';
import { textSizes } from 'theme/Typography';

const FormContainer = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.2)};
  flex: 1;
  padding: ${spacings.space100};
`;

const HeaderContainer = styled.View<{}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: ${spacings.space200};
`;

const CloseButton = styled.TouchableOpacity<{ backgroundColor: string }>`
  border-radius: 100px;
  background-color: ${({ backgroundColor }) => rgba(backgroundColor, 0.2)};
  color: black;
  padding: 2px;
`;

const SaveButtonText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-family: NunitoSans-Bold;
  font-size: ${textSizes.regular};
`;

const StyledTextInput = styled.TextInput`
  background-color: white;
  border-radius: ${spacings.space50};
  font-size: ${textSizes.medium};
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

const palletteInCustomOrder: Array<PaletteColor> = [
  // 1st row
  palette.LimeGreen,
  palette.LightCoral,
  palette.SandyBrown,
  palette.GoldenRod,
  palette.LightBlue,
  palette.LightSkyBlue,
  // 2nd row
  palette.BlueViolet,
  palette.LightPink,
  palette.DimGray,
  palette.GreenYellow,
  palette.OrangeRed,
  palette.Orange,
  // 3rd row
  palette.Gold,
  palette.SkyBlue,
  palette.SteelBlue,
  palette.Purple,
  palette.Crimson,
  palette.DarkGoldenRod,
]

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

const glyphsInCustomOrder: Array<GlyphIcon> = [
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

interface Props {
  initialValues?: TaskListUpdate;
  onPressClose: () => void;
  onPressSave: ({ name, color, icon }: TaskListUpdate) => Promise<void>;
}

export function EditListForm({ initialValues, onPressClose, onPressSave }: Props) {
  const [activeColor, setActiveColor] = useState(
    initialValues && initialValues.color || palletteInCustomOrder[0]
  );
  const [activeIcon, setActiveIcon] = useState(
    initialValues && initialValues.icon || glyphsInCustomOrder[0]
  );
  const [listName, setListName] = useState(
    initialValues && initialValues.name || ''
  );

  const canSaveList = Boolean(listName);

  const selectableItemsPerRow = 6;
  const selectableItemSize = useMemo(() => {
    return getItemSizeOnScreen(selectableItemsPerRow, spacings.unitless.space100);
  }, [selectableItemsPerRow]);

  return (
    <FormContainer backgroundColor={activeColor}>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      {/* fixme: the header shouldn't be scrollable */}
      <HeaderContainer>
        <CloseButton
          backgroundColor={palette.DimGray}
          onPress={onPressClose}
        >
          <Ionicons name="close" size={20} color={palette.DimGray} />
        </CloseButton>

        {/* Fixme: Make the icon more centered. It's a bit scewed to the left becuase "Save" button takes more space than the "Close" button */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <FontelloIcon
            name={activeIcon}
            color={activeColor}
            // size={selectableItemSize * 0.9}
            size={32}
          />
        </View>
        <TouchableOpacity
          disabled={!canSaveList}
          onPress={() => onPressSave({
            name: listName,
            color: activeColor,
            icon: activeIcon,
          })}
        >
          <SaveButtonText color={!canSaveList ? palette.DimGray : activeColor}>
            Save
          </SaveButtonText>
        </TouchableOpacity>
      </HeaderContainer>

      <StyledTextInput
        selectionColor={activeColor}
        value={listName}
        onChangeText={setListName}
      />

      <PaletteContainer>
        {palletteInCustomOrder.map((color, index) => {
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
        {glyphsInCustomOrder.map((glyphName, id) => {
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
                color={isActive ? activeColor : palette.DimGray}
                size={28} // ?? how it relates with the calculated item size?? (fixme!)
              />
            </IconItem>
          );
        })}
      </IconContainer>
    </FormContainer>
  );
}

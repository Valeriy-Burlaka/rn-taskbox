import { transformInputActions } from './transformParameters';

describe('input actions transformer', () => {
  it('transforms input correctly', () => {
    const blueHandler = () => console.log('Blue');
    const redHandler = () => console.log('Red');
    const greenHandler = () => console.log('Green');
    const yellowHandler = () => console.log('Yellow');
    const blackHandler = () => console.log('Black');
    const inputActions = [
      {
        name: 'Blue',
        icon: 'pencil',
        isDisabled: true,
        onPress: blueHandler,
      },
      {
        name: 'Red',
        icon: 'trash',
        isDestructive: true,
        onPress: redHandler,
      },
      {
        name: 'Green',
        icon: 'eye',
        onPress: greenHandler,
        hasDelimiter: true,
      },
      {
        name: 'Yellow',
        icon: 'sun',
        onPress: yellowHandler,
        hasDelimiter: true,
      },
      {
        name: 'Black',
        icon: 'moon',
        onPress: blackHandler,
      },
    ];

    const [outputActions, handlerMap] = transformInputActions(inputActions);

    expect(outputActions.length).toEqual(3);
    expect(outputActions[0].inlineChildren).toEqual(true);
    expect(outputActions[0]).toHaveProperty('actions');
    expect(outputActions[0]['actions']).toEqual([
      {
        title: 'Blue',
        systemIcon: 'pencil',
        destructive: undefined,
        disabled: true,
        subtitletitle: '',
      },
      {
        title: 'Red',
        systemIcon: 'trash',
        destructive: true,
        disabled: undefined,
        subtitletitle: '',
      },
      {
        title: 'Green',
        systemIcon: 'eye',
        destructive: undefined,
        disabled: undefined,
        subtitletitle: '',
      },
    ]);

    expect(outputActions[1].inlineChildren).toEqual(true);
    expect(outputActions[1].actions).toEqual([
      {
        title: 'Yellow',
        systemIcon: 'sun',
        destructive: undefined,
        disabled: undefined,
        subtitletitle: '',
      },
    ]);

    expect(outputActions[2]).toEqual( {
      title: 'Black',
      systemIcon: 'moon',
      destructive: undefined,
      disabled: undefined,
      subtitletitle: '',
    });

    expect(Object.keys(handlerMap).length).toEqual(5);
    expect(handlerMap['0-Blue']).toEqual(blueHandler);
    expect(handlerMap['1-Red']).toEqual(redHandler);
    expect(handlerMap['2-Green']).toEqual(greenHandler);
    expect(handlerMap['0-Yellow']).toEqual(yellowHandler);
    expect(handlerMap['2-Black']).toEqual(blackHandler);
  });
});

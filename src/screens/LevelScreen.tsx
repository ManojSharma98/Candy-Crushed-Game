import {View, Text, Image, ImageBackground, FlatList} from 'react-native';
import React, {FC} from 'react';
import {commonStyles} from '../styles/commonStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {levelStyles} from '../styles/levelStyles';
import {ScalePress} from '../components/ui/ScalePress';
import {goBack, navigate} from '../utils/NavigationUtil';
import {useLevelStore} from '../state/useLevelStore';
import {gameLevels} from '../utils/data';

const LevelScreen: FC = () => {
  const {levels} = useLevelStore();

  const levelPressHandler = (id: String) => {
    const levelKey = `level${id}` as keyof GameLevels;
    const level = gameLevels[levelKey];
    navigate('GameScreen', {level: {...level, id: id}});
  };

  const renderItem = ({item}: any) => {
    const opacity = item.unlocked ? 1 : 0.5;
    const emoji = item.completed ? '🎉' : item.unlocked ? '🍬' : '🔒';
    return (
      <ScalePress
        style={levelStyles.levelItem}
        onPress={() => {
          if (item.unlocked) levelPressHandler(item.id.toString());
        }}>
        <View style={{opacity}}>
          <Text style={levelStyles.levelText}>{emoji}</Text>
          <Text style={levelStyles.levelText}>Level {item?.id}</Text>
          {item?.highScore > 0 && (
            <Text style={levelStyles.levelText}>{item?.highScore}</Text>
          )}
        </View>
      </ScalePress>
    );
  };

  return (
    <ImageBackground
      style={commonStyles.container}
      source={require('../assets/images/forest.jpeg')}>
      <SafeAreaView edges={{top: 'maximum', left: 'off'}} />
      <View style={levelStyles.flex1}>
        <ScalePress onPress={() => goBack()}>
          <Image
            source={require('../assets/icons/back.png')}
            style={levelStyles.backIcon}
          />
        </ScalePress>
        <ImageBackground
          source={require('../assets/images/lines.jpg')}
          style={levelStyles.levelContainer}>
          <View style={levelStyles.subLevelContainer}>
            <FlatList
              data={levels}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={levelStyles.columnWrapper}
              ListFooterComponent={
                <View style={levelStyles.comingSoonContainer}>
                  <Image
                    source={require('../assets/images/doddle.png')}
                    style={levelStyles.doddle}
                  />
                  <Text style={levelStyles.comingSoonText}>
                    More levels coming soon!
                  </Text>
                </View>
              }
            />
          </View>
        </ImageBackground>

        <View style={levelStyles.flex2}>
          <Text style={levelStyles.text}>
            Rule: Collect the minimum amount of candy before the time runs out
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LevelScreen;

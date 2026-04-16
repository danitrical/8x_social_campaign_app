import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../types';
import { CampaignListScreen } from '../screens/CampaignListScreen';
import { CampaignDetailScreen } from '../screens/CampaignDetailScreen';
import { SubmitVideoScreen } from '../screens/SubmitVideoScreen';
import { SubmissionStatusScreen } from '../screens/SubmissionStatusScreen';
import { Colors, Typography } from '../constants/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontSize: Typography.sizes.md,
          fontWeight: Typography.weights.bold,
          color: Colors.text.primary,
        },
        headerTintColor: Colors.primary,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="CampaignList"
        component={CampaignListScreen}
        options={{ title: 'Active Campaigns' }}
      />
      <Stack.Screen
        name="CampaignDetail"
        component={CampaignDetailScreen}
        options={({ route, navigation }) => ({
          title: 'Campaign Brief',
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() =>
                navigation.navigate('SubmissionStatus', {
                  campaignId: route.params.campaignId,
                  campaignTitle: '',
                })
              }
            >
              <Text style={styles.headerBtnText}>My Submissions</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="SubmitVideo"
        component={SubmitVideoScreen}
        options={{ title: 'Submit Video' }}
      />
      <Stack.Screen
        name="SubmissionStatus"
        component={SubmissionStatusScreen}
        options={{ title: 'Submission Status' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerBtn: {
    marginRight: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerBtnText: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
});

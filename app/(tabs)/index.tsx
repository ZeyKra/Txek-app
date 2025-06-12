import { SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, Image, Dimensions, Linking } from "react-native";

import { Text, View } from "@/components/Themed";
import { useState } from "react";
import config from "@/config.json";
import { navigate } from "expo-router/build/global-state/routing";

const { width, height } = Dimensions.get('window');


export default function TabIndex() {

  return (

    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header avec Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* Remplacez cette View par votre Image */}
            <Image
              source={require('@/assets/images/txek-logo.png')} // Ajoutez votre logo ici
              style={styles.logo}
              resizeMode="contain"
            />
            {/* Fallback si pas de logo */}
            {/* <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>TXEK</Text>
            </View> */}
          </View>

          <Text style={styles.title}>TXEK</Text>
          <Text style={styles.subtitle}>
            Jeu de cartes stratégique
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Maîtrisez l'art du combat de cartes stratégique dans ce jeu passionnant
            où chaque décision façonne votre destin.
          </Text>
        </View>

        {/* Statistiques du jeu */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2-8</Text>
            <Text style={styles.statLabel}>Joueurs</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15-45+</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Cartes</Text>
          </View>
        </View>

        {/* Règles rapides */}
        <View style={styles.rulesSection}>
          <Text style={styles.sectionTitle}>Comment jouer</Text>
          <View style={styles.rulesList}>
            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>1</Text>
              </View>
              <Text style={styles.ruleText}>Piochez 7 cartes de votre deck</Text>
            </View>
            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>2</Text>
              </View>
              <Text style={styles.ruleText}>Planifiez votre stratégie</Text>
            </View>
            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>3</Text>
              </View>
              <Text style={styles.ruleText}>Jouez vos cartes tactiquement</Text>
            </View>
            <View style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>4</Text>
              </View>
              <Text style={styles.ruleText}>Le moins de points gagne</Text>
            </View>
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              // Navigate to create-game page
              // Assuming you're using Expo Router
              navigate('/(tabs)/create-game');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Commencer à jouer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              const url = config.TXEK_URL; // Replace with your actual URL
              Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Site Officiel</Text>
          </TouchableOpacity>

        </View>

        {/* Citation inspirante */}
        <View style={styles.quoteSection}>
          <Text style={styles.quote}>
            "Dans TXEK, la stratégie prime sur la chance"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 36,
    fontFamily: 'FeatherBold', // Police appliquée
    color: '#212529',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    fontFamily: 'FeatherBold', // Police appliquée
  },
  descriptionSection: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'FeatherBold', // Police appliquée
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    minWidth: width * 0.25,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'FeatherBold', // Police appliquée
    color: '#212529',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    fontFamily: 'FeatherBold', // Police appliquée
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rulesSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'FeatherBold', // Police appliquée
    color: '#212529',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
  rulesList: {
    gap: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#212529',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ruleNumberText: {
    fontSize: 14,
    fontFamily: 'FeatherBold', // Police appliquée
    color: '#FFFFFF',
  },
  ruleText: {
    fontSize: 16,
    color: '#495057',
    flex: 1,
    fontFamily: 'FeatherBold', // Police appliquée
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#212529',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'FeatherBold', // Police appliquée
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'FeatherBold', // Police appliquée
    color: '#495057',
    letterSpacing: 0.5,
  },
  quoteSection: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    color: '#6C757D',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'FeatherBold', // Police appliquée
    lineHeight: 24,
  },
});
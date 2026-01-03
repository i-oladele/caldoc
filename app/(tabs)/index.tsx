import Logo from '@/assets/svg/logo.svg';
import { ThemedText } from '@/components/ThemedText';
import { useFavorites } from '@/context/FavoritesContext';
import { CALCULATIONS } from '@/data/calculations';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, ListRenderItem, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Bookmark from '../../assets/svg/Bookmark.svg';
import BookmarkFilled from '../../assets/svg/Bookmark_filled.svg';
import Search from '../../assets/svg/Search.svg';

interface Calculation {
  id: string;
  name?: string;        // Make name optional
  description?: string; // Make description optional
  category: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');
  const { toggleFavorite, isFavorite } = useFavorites();
  const searchInputRef = useRef<TextInput>(null);

  const validCalculations = CALCULATIONS.filter(calc => {
    if (!calc || typeof calc.id !== 'string' || typeof calc.category !== 'string') {
      console.warn('Invalid calculation object found:', calc);
      return false;
    }
    return true;
  });

  const filteredCalculations = validCalculations
    .filter(calc => {
      try {
        const name = String(calc?.name || '');
        const description = String(calc?.description || '');
        const query = String(searchQuery || '').toLowerCase();
        
        return (
          name.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      } catch (error) {
        console.error('Error filtering calculation:', calc, error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        const nameA = String(a?.name || '');
        const nameB = String(b?.name || '');
        return nameA.localeCompare(nameB);
      } catch (error) {
        console.error('Error sorting calculations:', error);
        return 0;
      }
    });

  const displayedCalculations =
    activeTab === 'home'
      ? filteredCalculations
      : filteredCalculations.filter(calc => isFavorite(calc.id));

  const renderCalculationItem: ListRenderItem<Calculation> = ({ item }) => {
    const isBookmarked = isFavorite(item.id);
    
    return (
      <View style={styles.calculationItem}>
        <Link href={`/calculator/${item.category.toLowerCase()}/${item.id}`} asChild>
          <TouchableOpacity style={styles.calculationContent}>
            <ThemedText style={styles.calculationName}>{item.name}</ThemedText>
            <ThemedText style={styles.calculationDescription}>{item.description}</ThemedText>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          {isBookmarked ? (
            <BookmarkFilled width={24} height={24} color="#3D50B5" />
          ) : (
            <Bookmark width={24} height={24} color="#3D50B5" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Logo width={32} height={32} />
            <ThemedText style={styles.title}>Caldoc</ThemedText>
          </View>
          <TouchableOpacity style={styles.donateButton} activeOpacity={0.85}>
            <ThemedText style={styles.donateButtonText}>Donate</ThemedText>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          activeOpacity={1}
          style={[
            styles.searchContainer,
            isSearchFocused && styles.searchContainerFocused
          ]}
          onPress={() => {
            searchInputRef.current?.focus();
          }}
        >
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {!isSearchFocused && (
            <Search width={24} height={24} stroke="#7C7C7C" />
          )}
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'home' && styles.activeTab]}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Home</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>Favorites</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList<Calculation>
          data={displayedCalculations}
          renderItem={renderCalculationItem}
          keyExtractor={(item: Calculation) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            activeTab === 'favorites' ? (
              <ThemedText style={styles.emptyStateText}>
                No favorites yet. Tap the bookmark on a calculator to save it here.
              </ThemedText>
            ) : (
              <ThemedText style={styles.emptyStateText}>No calculators found.</ThemedText>
            )
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  header: {
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  donateButton: {
    backgroundColor: '#3D50B5',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#3D50B5',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'DMSans_600SemiBold',
  },
  title: {
    fontSize: 28,
    fontFamily: 'DMSans_700Bold',
    color: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3D50B5',
    shadowColor: '#3D50B5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'DMSans_400Regular',
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  tabText: {
    fontSize: 16,
    color: '#7C7C7C',
    fontFamily: 'DMSans_500Medium',
  },
  activeTabText: {
    color: '#3D50B5',
    fontFamily: 'DMSans_600SemiBold',
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingBottom: 32,
  },
  calculationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  calculationContent: {
    flex: 1,
    marginRight: 16,
  },
  calculationName: {
    fontSize: 18,
    fontFamily: 'DMSans_600SemiBold',
    color: '#3D50B5',
    marginBottom: 4,
  },
  calculationDescription: {
    fontSize: 14,
    fontFamily: 'DMSans_400Regular',
    color: '#666666',
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 32,
    fontSize: 16,
    fontFamily: 'DMSans_500Medium',
  },
});

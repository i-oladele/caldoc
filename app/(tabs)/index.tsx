import { ThemedText } from '@/components/ThemedText';
import { useFavorites } from '@/context/FavoritesContext';
import { CALCULATIONS } from '@/data/calculations';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Bookmark from '../../assets/svg/Bookmark.svg';
import BookmarkFilled from '../../assets/svg/Bookmark_filled.svg';
import Search from '../../assets/svg/Search.svg';

interface Calculation {
  id: string;
  name: string;
  description: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const searchInputRef = useRef<TextInput>(null);

  const filteredCalculations = CALCULATIONS
    .filter(calc =>
      calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderCalculationItem: ListRenderItem<Calculation> = ({ item }) => {
    const isBookmarked = isFavorite(item.id);
    
    return (
      <View style={styles.calculationItem}>
        <Link href={`/(calculator)/${item.id}`} asChild>
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
      <View style={styles.header}>
        <ThemedText style={styles.title}>Caldoc</ThemedText>
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

      <FlatList<Calculation>
        data={filteredCalculations}
        renderItem={renderCalculationItem}
        keyExtractor={(item: Calculation) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
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
    margin: 16,
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
  },
  listContainer: {
    padding: 16,
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
});

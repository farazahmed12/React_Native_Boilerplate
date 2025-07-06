import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// RTK Query
import {useGetProductsInfiniteQuery} from '../store/apiSlice';

const DuplicateItemsRtk = () => {
  // states
  const [search, setSearch] = useState('');

  const queryParams = useMemo(
    () => ({
      search: search || '', // Always pass a string, never undefined
      limit: 10, // Add explicit limit
    }),
    [search],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    refetch,
    error,
  } = useGetProductsInfiniteQuery(queryParams);

  const products = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    console.log('Flattening pages:', data.pages);

    // Flatten all pages into a single array
    const flattened = data.pages.flatMap(page => page.products || []);

    console.log('Flattened products:', flattened.length);

    return flattened;
  }, [data?.pages]);

  // Memoized load more function
  const loadMore = useCallback(() => {
    console.log('Load more called:', {hasNextPage, isFetchingNextPage});

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Memoized refresh function
  const onRefresh = useCallback(() => {
    console.log('Refresh called');
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const ListFooterComponent = () => {
    if (isFetchingNextPage && hasNextPage && products?.length > 0) {
      return (
        <View style={{padding: 20, alignItems: 'center'}}>
          <ActivityIndicator size="large" />
          <Text style={{marginTop: 10}}>Loading more...</Text>
        </View>
      );
    }
    return null;
  };

  console.log('Items loaded:', products);
  console.log('Total items loaded:', data);
  console.log('hasNextPage:', hasNextPage);

  console.log('lenght:', products?.length);

  return (
    <SafeAreaView>
      <TextInput
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: '#DDDDDD',
          height: 80,
          borderWidth: 1,
          fontSize: 40,
        }}
      />
      <FlatList
        data={products}
        renderItem={({item}) => <Card item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isFetchingNextPage}
            onRefresh={onRefresh}
          />
        }
        ListFooterComponent={ListFooterComponent}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        // Additional props for better performance

        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 50,
            }}>
            <Text>No products found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const Card = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SingleItem', {itemId: item?._id});
      }}
      style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
      <View
        style={{
          width: 300,
          height: 100,
        }}>
        <Image
          source={{
            uri: item?.artworkUrl100 || 'https://via.placeholder.com/150',
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 10,
            resizeMode: 'cover',
          }}
        />
      </View>
      <Text>{item?.title}</Text>
      <Text>{item?.slug}</Text>
    </TouchableOpacity>
  );
};

export default DuplicateItemsRtk;

const styles = StyleSheet.create({});

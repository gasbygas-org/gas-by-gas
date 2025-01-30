import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getGasRequests } from '../../services/gasRequest';
import { loadAuthState } from '../../contexts/AuthContext';

const GasRequestScreen = ({ navigation }) => {
  const [userRequests, setUserRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserRequests = async (page) => {
    try {
      setLoading(true);
      const { storedUser } = await loadAuthState();
      const userId = storedUser.id;

      const response = await getGasRequests(page, 3, userId);

      setUserRequests(response.data);

      setTotalPages(response.pagination.totalPages);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to fetch requests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchUserRequests(prevPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUserRequests(nextPage);
    }
  };

  useEffect(() => {
    fetchUserRequests(1);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#e67e22';
      case 'Approved': return '#2ecc71';
      case 'Delivered': return '#27ae60';
      default: return '#666';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestCard}>
      <Text style={styles.requestDate}>
        Created: {new Date(item.created_at).toLocaleDateString()}
      </Text>
      <Text>Outlet: {item.outlet}</Text>
      <Text>Gas Type: {item.gas_type}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text style={[styles.status, { color: getStatusColor(item.request_status) }]}>
        Status: {item.request_status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Text style={styles.title}>Gas Requests</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="New Request"
          onPress={() => navigation.replace('GasRequestForm')}
          color="#2e86de"
        />
        <Button
          title="Back to Profile"
          onPress={() => navigation.replace('Profile')}
          color="#666"
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={userRequests}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No requests found</Text>
            }
          />

          <View style={styles.paginationContainer}>
            <Button
              title="Previous"
              onPress={handlePrevious}
              disabled={currentPage === 1 || loading}
              color="#3498db"
            />

            <Text style={styles.pageText}>
              Page {currentPage} of {totalPages > 0 ? totalPages : 1}
            </Text>

            <Button
              title="Next"
              onPress={handleNext}
              disabled={currentPage === totalPages || loading || totalPages === 0}
              color="#3498db"
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  requestCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  requestDate: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    marginTop: 5,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  pageText: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  loader: {
    marginVertical: 20,
  },
});

export default GasRequestScreen;

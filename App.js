import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SectionList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  // Default categories
  const categories = [
    'Food',
    'Transport',
    'Entertainment',
    'Bills',
    'Shopping',
    'Healthcare',
  ];

  // Add a new expense
  const addExpense = () => {
    if (!expenseName || !expenseAmount || !expenseCategory) {
      Alert.alert('Error', 'Please enter name, amount, and category.');
      return;
    }

    const newExpense = {
      id: Math.random().toString(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
    };

    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
    setExpenseName('');
    setExpenseAmount('');
    setExpenseCategory('');
  };

  // Delete an expense
  const deleteExpense = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
  };

  // Group expenses by category
  const groupExpensesByCategory = () => {
    return expenses.reduce((grouped, expense) => {
      if (!grouped[expense.category]) {
        grouped[expense.category] = [];
      }
      grouped[expense.category].push(expense);
      return grouped;
    }, {});
  };

  // Render individual expense item
  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.expenseText}>{item.name}</Text>
      <Text style={styles.expenseText}>${item.amount.toFixed(2)}</Text>
      <Button
        title="Delete"
        onPress={() => deleteExpense(item.id)}
        color="red"
      />
    </View>
  );

  // Render Section Header
  const renderSectionHeader = ({ section }) => (
    <Text style={styles.categoryHeader}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expensify - Manage Your Funds</Text>

      {/* Add Expense */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Expense Name"
          value={expenseName}
          onChangeText={setExpenseName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={expenseAmount}
          onChangeText={setExpenseAmount}
          keyboardType="numeric"
        />
        
        {/* Category Picker */}
        <Picker
          selectedValue={expenseCategory}
          onValueChange={(itemValue) => setExpenseCategory(itemValue)}
          style={styles.input}
        >
          <Picker.Item label="Select Category" value="" />
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>

        <Button title="Add Expense" onPress={addExpense} />
      </View>

      {/* Total Expenses */}
      <Text style={styles.total}>Total Expenses: ${getTotalExpenses()}</Text>

      {/* List of Expenses categorized */}
      {expenses.length > 0 ? (
        <SectionList
          sections={Object.keys(groupExpensesByCategory()).map((category) => ({
            title: category,
            data: groupExpensesByCategory()[category],
          }))}
          renderItem={renderExpenseItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.noExpenses}>No expenses added yet!</Text>}
        />
      ) : (
        <Text style={styles.noExpenses}>No expenses added yet!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#007bff',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  expenseText: {
    fontSize: 16,
    color: '#333',
  },
  noExpenses: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    paddingVertical: 5,
  },
});

import React, { useState } from 'react';
import { StyleSheet, TextInput, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Screen = () => {
    const [todoText, setTodoText] = useState('');
    const [todos, setTodos] = useState([]);
    const [isAllCompleted, setIsAllCompleted] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('All');
    const [editIndex, setEditIndex] = useState(null);
    const [editedText, setEditedText] = useState('');

    const handleAddTodo = () => {
        if (todoText.trim() === '') {
            return;
        }

        setTodos([...todos, { text: todoText, isCompleted: false }]);
        setTodoText('');
    };

    const handleDeleteTodo = (index) => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };

    const handleToggleCompletion = (index) => {
        const newTodos = [...todos];
        newTodos[index].isCompleted = !newTodos[index].isCompleted;
        setTodos(newTodos);
    };

    const handleToggleAll = () => {
        const newTodos = todos.map((todo) => {
            return { ...todo, isCompleted: !isAllCompleted };
        });
        setTodos(newTodos);
        setIsAllCompleted(!isAllCompleted);
    };

    const countActiveTodos = () => {
        return todos.filter((todo) => !todo.isCompleted).length;
    };

    const clearCompleted = () => {
        const newTodos = todos.filter((todo) => !todo.isCompleted);
        setTodos(newTodos);
    };

    const handleStartEdit = (index) => {
        const newTodos = [...todos];
        newTodos[index].isEditing = true;
        setEditIndex(index);
        setEditedText(newTodos[index].text);
        setTodos(newTodos);
      };

      const handleSaveEdit = (index) => {
        const newTodos = [...todos];
        newTodos[index].text = editedText;
        newTodos[index].isEditing = false;
        setTodos(newTodos);
        setEditIndex(null);
      };
    
      const handleCancelEdit = (index) => {
        const newTodos = [...todos];
        newTodos[index].isEditing = false;
        setTodos(newTodos);
        setEditIndex(null);
      };  

    const TodoItem = ({ todo, index }) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 0.5, fontSize: 25, color: '#000', padding: 5 }}>
                {todo.isEditing ? (
                    <>
                    <TouchableOpacity onPress={() => handleSaveEdit(index)} key="save-edit">
                        <MaterialIcons name="done" size={24} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleCancelEdit(index)} key="cancel-edit">
                        <MaterialIcons name="cancel" size={24} color="#e04400" />
                    </TouchableOpacity>
                    <TextInput
                    style={{ color: todo.isCompleted ? 'gray' : '#000', fontSize: 22, textDecorationLine: todo.isCompleted ? 'line-through' : 'none', borderLeftWidth: 1, borderLeftColor: 'red', padding: 5, backgroundColor: '#fff', height: 35, fontSize: 20, opacity: 0.8, flex: 1}}
                    value={editedText}
                    onChangeText={(text) => setEditedText(text)}
                    key="input-edit"
                    />
                    </>
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => handleToggleCompletion(index)} key="complate-butt">
                        <MaterialIcons name="done" size={24} color={todo.isCompleted ? "#437a49" : "grey" }/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleStartEdit(index)} key="edit-butt">
                        <MaterialIcons name="edit" size={24} color="#42b0f5" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteTodo(index)} key="del-butt">
                        <MaterialIcons name="close" size={24} color="#e04400" />
                    </TouchableOpacity>
                    <Text style={{ color: todo.isCompleted ? 'gray' : '#000', fontSize: 22, textDecorationLine: todo.isCompleted ? 'line-through' : 'none', borderLeftWidth: 1, borderLeftColor: 'red', padding: 5, backgroundColor: '#fff', height: 35, fontSize: 20, opacity: 0.8, flex: 1 }}>
                    {todo.text}
                    </Text>                    
                </View> 
                )}
            </View>
        );
    };

    const filteredTodos = () => {
        if (currentFilter === 'All') {
            return todos;
        } else if (currentFilter === 'Active') {
            return todos.filter((todo) => !todo.isCompleted);
        } else if (currentFilter === 'Completed') {
            return todos.filter((todo) => todo.isCompleted);
        }
    };

    return (
        <View style={styles.main}>
            <View style={{ backgroundColor: 'white', borderTopWidth: 10, borderTopColor: 'brown', padding: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {todos.length > 0 && (
                    <TouchableOpacity onPress={handleToggleAll} key="complate-all-butt">
                        <MaterialIcons
                        name='check-box'
                        size={30}
                        color={isAllCompleted ? '#437a49' : 'grey'}
                        />
                    </TouchableOpacity>
                    )}
                    <TextInput
                    style={styles.input}
                    placeholder="What needs to be done?"
                    placeholderTextColor="gray"
                    value={todoText}
                    onChangeText={(text) => setTodoText(text)}
                    onSubmitEditing={handleAddTodo}
                    key="new-todo-input"
                    />
                </View>
            </View>
            <FlatList
                data={filteredTodos()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <TodoItem todo={item} index={index} />
                )}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#83756f' }}>{countActiveTodos()} items left</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => setCurrentFilter('All')} key="view-all-butt">
                        <Text style={{ fontSize: 12, color: '#83756f', fontWeight: currentFilter === 'All' ? 'bold' : 'normal', marginRight: 5 }}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentFilter('Active')} key="view-active-butt">
                        <Text style={{ fontSize: 12, color: '#83756f', fontWeight: currentFilter === 'Active' ? 'bold' : 'normal', marginRight: 5 }}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentFilter('Completed')} key="view-complated-butt">
                        <Text style={{ fontSize: 12, color: '#83756f', fontWeight: currentFilter === 'Completed' ? 'bold' : 'normal' }}>Completed</Text>
                    </TouchableOpacity>
                </View>
                {todos.some((todo) => todo.isCompleted) && (
                    <TouchableOpacity onPress={clearCompleted} key="clear-all-complated-butt">
                        <Text style={{ fontSize: 12, color: 'red', backgroundColor: 'rgba(0, 0, 0, 0.1)', color: '#777'}}>Clear Completed</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        width: '90%',
    },
    input: {
        backgroundColor: '#fff',
        height: 35,
        fontSize: 20,
        opacity: 0.8,
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: 'red',
        paddingLeft: 5,
    },
});

export default Screen;

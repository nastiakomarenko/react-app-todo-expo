import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, FlatList, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Screen = () => {
    const [todoText, setTodoText] = useState('');
    const [todos, setTodos] = useState([]);
    const [isAllCompleted, setIsAllCompleted] = useState(false);
    const [currentFilter, setCurrentFilter] = useState('All');
    const [editIndex, setEditIndex] = useState(null);
    const [editedText, setEditedText] = useState('');
    const inputRef = useRef();

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
        if (editedText !== '') { 
            newTodos[index].text = editedText;
            newTodos[index].isEditing = false;
            setTodos(newTodos);
            setEditIndex(null);
        }
    };

    const handleCancelEdit = (index) => {
        const newTodos = [...todos];
        newTodos[index].isEditing = false;
        setTodos(newTodos);
        setEditIndex(null);
    };

    const TodoItem = ({ todo, index }) => {
        return (
            <View style={styles.todoItemContainer}>
                {todo.isEditing ? (
                    <>
                        <TouchableOpacity onPress={() => handleSaveEdit(index)} key="save-edit">
                            <MaterialIcons name="done-outline" size={24} color="green" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCancelEdit(index)} key="cancel-edit">
                            <MaterialIcons name="cancel" size={24} color="#e04400" />
                        </TouchableOpacity>
                        <TextInput
                            style={[
                                styles.editInput,
                                {
                                    color: todo.isCompleted ? 'gray' : '#000',
                                    textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
                                },
                            ]}
                            ref={inputRef}
                            onChangeText={setEditedText}
                            value={editedText}
                            onSubmitEditing={() => {
                                if (editedText.trim() !== '') {
                                    handleSaveEdit(index);
                                }
                                else {
                                    handleDeleteTodo(index);
                                }
                            }}
                            key="input-edit"
                            onBlur={setTimeout(() => {
                                inputRef.current?.focus()
                            }, 0)}            
                            blurOnSubmit={false}
                        />
                    </>
                ) : (
                    <View style={styles.todoItemInnerContainer}>
                        <TouchableOpacity onPress={() => handleToggleCompletion(index)} key="complete-butt">
                            <MaterialIcons
                                name="done"
                                size={24}
                                color={todo.isCompleted ? '#437a49' : 'grey'}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleStartEdit(index)}>
                            <Text
                                style={[
                                    styles.todoItemText,
                                    {
                                        color: todo.isCompleted ? 'gray' : '#000',
                                        textDecorationLine: todo.isCompleted ? 'line-through' : 'none',
                                    },
                                ]}
                            >
                                {todo.text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteTodo(index)} key="del-butt">
                            <MaterialIcons name="close" size={24} color="#e04400" />
                        </TouchableOpacity>
                        
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
            <View style={styles.headerContainer}>
                <View style={styles.headerInnerContainer}>
                    {todos.length > 0 && (
                        <TouchableOpacity onPress={handleToggleAll} key="complete-all-butt">
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
                renderItem={({ item, index }) => <TodoItem todo={item} index={index} />}
            />
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{countActiveTodos()} items left</Text>
                <View style={styles.filterButtonsContainer}>
                    <TouchableOpacity onPress={() => setCurrentFilter('All')} key="view-all-butt">
                        <Text
                            style={[
                                styles.filterButtonText,
                                { fontWeight: currentFilter === 'All' ? 'bold' : 'normal' },
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentFilter('Active')} key="view-active-butt">
                        <Text
                            style={[
                                styles.filterButtonText,
                                { fontWeight: currentFilter === 'Active' ? 'bold' : 'normal' },
                            ]}
                        >
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCurrentFilter('Completed')} key="view-completed-butt">
                        <Text
                            style={[
                                styles.filterButtonText,
                                { fontWeight: currentFilter === 'Completed' ? 'bold' : 'normal' },
                            ]}
                        >
                            Completed
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={clearCompleted}
                    key="clear-completed-butt"
                >
                    <Text style={{
                        ...styles.clearCompletedText,
                        display: todos.some((todo) => todo.isCompleted) ? 'block' : 'none'
                    }}>Clear Completed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        width: '90%',
    },
    headerContainer: {
        backgroundColor: 'white',
        borderTopWidth: 10,
        borderTopColor: 'brown',
        padding: 10,
    },
    headerInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        ...commonInputStyles,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    footerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#83756f',
    },
    filterButtonsContainer: {
        paddingRight: 0,
        flexDirection: 'row',
    },
    filterButtonText: {
        fontSize: 12,
        color: '#83756f',
        marginRight: 5,
    },
    clearCompletedText: {
        fontSize: 12,
        color: 'red',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        color: '#777',
    },
    todoItemContainer: {
        ...commonItemStyles,
    },
    editInput: {
        ...commonInputStyles,
    },
    todoItemInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    todoItemText: {
        ...commonTextStyles,
    },
});

const commonInputStyles = {
    backgroundColor: '#fff',
    height: 35,
    fontSize: 20,
    opacity: 0.8,
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: 'red',
    paddingLeft: 5,
};

const commonItemStyles = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 0.5,
    fontSize: 25,
    color: '#000',
    padding: 5,
};

const commonTextStyles = {
    color: 'gray',
    fontSize: 22,
    textDecorationLine: 'line-through',
    borderLeftWidth: 1,
    borderLeftColor: 'red',
    padding: 5,
    backgroundColor: '#fff',
    height: 35,
    fontSize: 20,
    opacity: 0.8,
    flex: 1,
};

export default Screen;

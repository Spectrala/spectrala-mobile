import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Text,
  View,
} from "react-native";

export default function CapturedCell({ spectrum, targetIndex }) {
  const activeProps = {
    shadowRadius: 4,
    shadowOpacity: 0.1,
  };
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        ...(props.isActive ? activeProps : {}),
      }}
    >
      <TouchableOpacity style={styles.buttonStyle} onPress={props.onDelete}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={props.onRename}
        value={props.label}
        placeholder="Spectrum name..."
        keyboardType="default"
      />

      <TouchableOpacity
        onPress={props.onSetReference}
        style={{
          ...styles.buttonStyle,
          ...(props.isReference ? styles.selectedButton : {}),
        }}
      >
        <Text
          style={{
            ...styles.buttonText,
            ...(props.isReference ? styles.selectedButtonText : {}),
          }}
        >
          Ref
        </Text>
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        {/* <PreviewChart data={props.data} /> */}
        <TouchableOpacity onLongPress={props.dragControl}>
          <MaterialIcons name="drag-indicator" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

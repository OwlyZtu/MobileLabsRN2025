import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';

interface BeautifulDateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  minimumDate?: Date;
}

const DateTimePicker: React.FC<BeautifulDateTimePickerProps> = ({
  value,
  onChange,
  label = 'Select Date & Time',
  minimumDate = new Date(),
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const showPicker = () => {
    setPickerVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hidePicker = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setPickerVisible(false));
  };

  const handleConfirm = (date: Date) => {
    onChange(date);
    hidePicker();
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString(undefined, options);
  };

  // Get time of day for custom greeting
  const getTimeOfDay = () => {
    const hour = value.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  // Get appropriate icon based on time
  const getTimeIcon = () => {
    const hour = value.getHours();
    if (hour < 6) return 'moon-o';
    if (hour < 12) return 'sun-o';
    if (hour < 18) return 'sun-o';
    return 'moon-o';
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={showPicker}
        activeOpacity={0.7}
      >
        <View style={styles.dateDisplay}>
          <View style={styles.iconContainer}>
            <FontAwesome name={getTimeIcon()} size={24} color="#fff" />
          </View>
          
          <View style={styles.dateTextContainer}>
            <Text style={styles.dateText}>{formatDate(value)}</Text>
            <Text style={styles.hintText}>
              Tap to change • Good {getTimeOfDay()}!
            </Text>
          </View>
          
          <FontAwesome name="angle-right" size={24} color="#aaa" />
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        minimumDate={minimumDate}
        date={value}
        // Additional props for better appearance
        confirmTextIOS="Confirm"
        cancelTextIOS="Cancel"
        buttonTextColorIOS="#4a6fa5"
        modalStyleIOS={styles.pickerModalIOS}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pickerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4a6fa5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  hintText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  pickerModalIOS: {
    borderRadius: 16,
  },
});

export default DateTimePicker;
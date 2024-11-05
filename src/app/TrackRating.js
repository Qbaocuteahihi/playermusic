import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"; // Thêm Text vào import
import { FontAwesome } from "@expo/vector-icons";
import { colors, fontSize } from "@/constants/tokens";

const TrackRating = ({
  initialRating,
  onRatingChange,
  activeColor = colors.primary,
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleRatingPress = (index) => {
    setRating(index + 1);
    onRatingChange(index + 1);
  };

  return (
    <View style={styles.container}>
      {[...Array(5)].map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleRatingPress(index)}
          style={styles.ratingIcon}
        >
          <FontAwesome
            name={index < rating ? "star" : "star-o"}
            size={16}
            color={index < rating ? activeColor : colors.icon}
          />
        </TouchableOpacity>
      ))}
      {/* Hiển thị điểm đánh giá dưới dạng văn bản */}
      <Text style={styles.ratingText}>{rating} / 5</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingIcon: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: fontSize.small,
    marginLeft: 8,
    color: colors.white, // Thay đổi màu sắc nếu cần
  },
});

export { TrackRating };

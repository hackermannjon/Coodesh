import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface AudioPlayerProps {
  audioUrl: string | undefined;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const playSound = async () => {
    if (!audioUrl) return;
    setLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    }
    setLoading(false);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <AudioButton
      onPress={isPlaying ? stopSound : playSound}
      disabled={!audioUrl}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : isPlaying ? (
        <Ionicons name="pause-circle" size={24} color="white" />
      ) : (
        <Ionicons name="volume-high" size={24} color="white" />
      )}
    </AudioButton>
  );
}

// Estilos
const AudioButton = styled(TouchableOpacity)`
  background-color: #3f51b5;
  padding: 10px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

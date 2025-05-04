import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import React, { useCallback, useEffect, useState } from 'react'
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat'
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Audio } from 'expo-av'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function ChatScreen() {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState(null)

  const currentUser = { _id: 1, name: 'Tomar' }

  const WEBHOOK_URL =
    'url here'

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello bhai kaisa hai?.',
        createdAt: new Date(),
        user: { _id: 2, name: 'Khatabook' },
      },
    ])
  }, [])

  const handleMicPress = async () => {
    if (isRecording) {
      await stopRecording()
    } else {
      await startRecording()
    }
  }

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const rec = new Audio.Recording()
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
      await rec.startAsync()
      setRecording(rec)
      setIsRecording(true)
    } catch (e) {
      console.error('Recording start error', e)
    }
  }

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setRecording(null)
      setIsRecording(false)
      await uploadAudio(uri)
    } catch (e) {
      console.error('Recording stop error', e)
    }
  }

  const uploadAudio = async (uri) => {
    setIsTyping(true)
    const form = new FormData()
    form.append('file', {
      uri,
      name: `voice-${uuidv4()}.wav`,
      type: 'audio/wav',
    })
    form.append('user', 'tomar')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: form,
      })
      const data = await response.json()

      const reply =
        data?.reply || data?.[0]?.output || 'Server se jawab nahi aaya.'

      const botMessage = {
        _id: Date.now(),
        text: reply,
        createdAt: new Date(),
        user: { _id: 2, name: 'Khatabook' },
      }
      setMessages((prev) => GiftedChat.append(prev, [botMessage]))
    } catch (err) {
      console.error('Upload error', err)
    } finally {
      setIsTyping(false)
    }
  }

  const onSend = useCallback(async (newMessages = []) => {
    setIsTyping(true)
    const userMessage = newMessages[0]
    setMessages((prev) => GiftedChat.append(prev, newMessages))
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text,
          user: 'tomar',
        }),
      })
      const data = await res.json()
      const reply =
        data?.reply || data?.[0]?.output || 'Server se jawab nahi aaya.'
      const botMessage = {
        _id: Date.now(),
        text: reply,
        createdAt: new Date(),
        user: { _id: 2, name: 'Khatabook' },
      }
      setMessages((prev) => GiftedChat.append(prev, [botMessage]))
    } catch (e) {
      console.error(e)
    } finally {
      setIsTyping(false)
    }
  }, [])

  const renderSend = (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center' , marginBottom:20}}>
      <TouchableOpacity onPress={handleMicPress} style={{ marginHorizontal: 8  , marginTop:18}}>
        <Icon
          name={isRecording ? 'stop-circle' : 'mic'}
          size={28}
          color={isRecording ? 'red' : '#fff'}
        />
      </TouchableOpacity>
      <Send {...props}>
        <Icon name="send" size={25} color="#fff" />
      </Send>
    </View>
  )

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={currentUser}
        placeholder="Type or record message..."
        renderSend={renderSend}
        renderAvatar={null}
        showUserAvatar={false}
        alwaysShowSend
        scrollToBottom
        isTyping={isTyping}
        renderBubble={renderCustomBubble}
        renderInputToolbar={renderCustomInputToolbar}
      />
    </View>
  )
}

const renderCustomBubble = (props) => (
  <Bubble
    {...props}
    wrapperStyle={{
      right: { backgroundColor: 'gray' },
      left: { backgroundColor: 'transparent' },
    }}
    textStyle={{
      right: { color: '#fff' },
      left: { color: '#eee' },
    }}
  />
)

const renderCustomInputToolbar = (props) => (
  <InputToolbar
    {...props}
    containerStyle={{
      backgroundColor: '#1a1a1a',
      borderTopColor: '#333',
      borderTopWidth: 1,
      paddingHorizontal: 8,
    }}
    primaryStyle={{ alignItems: 'center' }}
    textInputStyle={{ color: '#fff', fontSize: 14 }}
  />
)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
})

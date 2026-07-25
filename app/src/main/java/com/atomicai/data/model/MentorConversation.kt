package com.atomicai.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

data class Message(
    val sender: MessageSender,
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "mentor_conversations")
data class MentorConversation(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val date: String, // Format: YYYY-MM-DD
    val type: ConversationType,
    val messages: List<Message> = emptyList(),
    val detectedPattern: String? = null
)

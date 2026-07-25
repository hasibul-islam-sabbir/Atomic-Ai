package com.atomicai.data.repository

import com.atomicai.data.local.MentorConversationDao
import com.atomicai.data.model.ConversationType
import com.atomicai.data.model.MentorConversation
import kotlinx.coroutines.flow.Flow

class MentorRepository(private val mentorConversationDao: MentorConversationDao) {
    val allConversations: Flow<List<MentorConversation>> = mentorConversationDao.getAllConversations()

    fun getConversationsByType(type: ConversationType): Flow<List<MentorConversation>> {
        return mentorConversationDao.getConversationsByType(type)
    }

    suspend fun getConversationById(id: Long): MentorConversation? {
        return mentorConversationDao.getConversationById(id)
    }

    suspend fun saveConversation(conversation: MentorConversation): Long {
        return mentorConversationDao.insertConversation(conversation)
    }

    suspend fun updateConversation(conversation: MentorConversation) {
        mentorConversationDao.updateConversation(conversation)
    }

    suspend fun deleteConversation(conversation: MentorConversation) {
        mentorConversationDao.deleteConversation(conversation)
    }
}

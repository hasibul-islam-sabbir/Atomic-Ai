package com.atomicai.data.local

import androidx.room.*
import com.atomicai.data.model.ConversationType
import com.atomicai.data.model.MentorConversation
import kotlinx.coroutines.flow.Flow

@Dao
interface MentorConversationDao {
    @Query("SELECT * FROM mentor_conversations ORDER BY id DESC")
    fun getAllConversations(): Flow<List<MentorConversation>>

    @Query("SELECT * FROM mentor_conversations WHERE type = :type ORDER BY id DESC")
    fun getConversationsByType(type: ConversationType): Flow<List<MentorConversation>>

    @Query("SELECT * FROM mentor_conversations WHERE id = :id")
    suspend fun getConversationById(id: Long): MentorConversation?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertConversation(conversation: MentorConversation): Long

    @Update
    suspend fun updateConversation(conversation: MentorConversation)

    @Delete
    suspend fun deleteConversation(conversation: MentorConversation)
}

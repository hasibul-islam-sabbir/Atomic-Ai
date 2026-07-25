package com.atomicai.data.local

import androidx.room.*
import com.atomicai.data.model.Reflection
import kotlinx.coroutines.flow.Flow

@Dao
interface ReflectionDao {
    @Query("SELECT * FROM reflections ORDER BY weekStartDate DESC")
    fun getAllReflections(): Flow<List<Reflection>>

    @Query("SELECT * FROM reflections WHERE weekStartDate = :weekStartDate LIMIT 1")
    suspend fun getReflectionByWeek(weekStartDate: String): Reflection?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReflection(reflection: Reflection): Long

    @Update
    suspend fun updateReflection(reflection: Reflection)

    @Delete
    suspend fun deleteReflection(reflection: Reflection)
}

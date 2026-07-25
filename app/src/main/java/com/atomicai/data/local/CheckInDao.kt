package com.atomicai.data.local

import androidx.room.*
import com.atomicai.data.model.CheckIn
import kotlinx.coroutines.flow.Flow

@Dao
interface CheckInDao {
    @Query("SELECT * FROM check_ins WHERE habitId = :habitId ORDER BY date DESC")
    fun getCheckInsForHabit(habitId: Long): Flow<List<CheckIn>>

    @Query("SELECT * FROM check_ins WHERE date = :date")
    fun getCheckInsByDate(date: String): Flow<List<CheckIn>>

    @Query("SELECT * FROM check_ins WHERE habitId = :habitId AND date = :date LIMIT 1")
    suspend fun getCheckIn(habitId: Long, date: String): CheckIn?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateCheckIn(checkIn: CheckIn): Long

    @Delete
    suspend fun deleteCheckIn(checkIn: CheckIn)
}

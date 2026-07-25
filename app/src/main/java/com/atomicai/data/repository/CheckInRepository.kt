package com.atomicai.data.repository

import com.atomicai.data.local.CheckInDao
import com.atomicai.data.model.CheckIn
import kotlinx.coroutines.flow.Flow

class CheckInRepository(private val checkInDao: CheckInDao) {
    fun getCheckInsForHabit(habitId: Long): Flow<List<CheckIn>> {
        return checkInDao.getCheckInsForHabit(habitId)
    }

    fun getCheckInsByDate(date: String): Flow<List<CheckIn>> {
        return checkInDao.getCheckInsByDate(date)
    }

    suspend fun getCheckIn(habitId: Long, date: String): CheckIn? {
        return checkInDao.getCheckIn(habitId, date)
    }

    suspend fun saveCheckIn(checkIn: CheckIn): Long {
        return checkInDao.insertOrUpdateCheckIn(checkIn)
    }

    suspend fun deleteCheckIn(checkIn: CheckIn) {
        checkInDao.deleteCheckIn(checkIn)
    }
}

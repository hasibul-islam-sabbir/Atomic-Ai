package com.atomicai.data.repository

import com.atomicai.data.local.HabitDao
import com.atomicai.data.model.Habit
import com.atomicai.data.model.HabitType
import kotlinx.coroutines.flow.Flow

class HabitRepository(private val habitDao: HabitDao) {
    val allHabits: Flow<List<Habit>> = habitDao.getAllHabits()

    fun getHabitsByType(type: HabitType): Flow<List<Habit>> {
        return habitDao.getHabitsByType(type)
    }

    suspend fun getHabitById(id: Long): Habit? {
        return habitDao.getHabitById(id)
    }

    suspend fun insertHabit(habit: Habit): Long {
        return habitDao.insertHabit(habit)
    }

    suspend fun updateHabit(habit: Habit) {
        habitDao.updateHabit(habit)
    }

    suspend fun deleteHabit(habit: Habit) {
        habitDao.deleteHabit(habit)
    }
}

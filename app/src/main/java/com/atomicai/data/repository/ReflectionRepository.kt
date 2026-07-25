package com.atomicai.data.repository

import com.atomicai.data.local.ReflectionDao
import com.atomicai.data.model.Reflection
import kotlinx.coroutines.flow.Flow

class ReflectionRepository(private val reflectionDao: ReflectionDao) {
    val allReflections: Flow<List<Reflection>> = reflectionDao.getAllReflections()

    suspend fun getReflectionByWeek(weekStartDate: String): Reflection? {
        return reflectionDao.getReflectionByWeek(weekStartDate)
    }

    suspend fun saveReflection(reflection: Reflection): Long {
        return reflectionDao.insertReflection(reflection)
    }

    suspend fun updateReflection(reflection: Reflection) {
        reflectionDao.updateReflection(reflection)
    }

    suspend fun deleteReflection(reflection: Reflection) {
        reflectionDao.deleteReflection(reflection)
    }
}

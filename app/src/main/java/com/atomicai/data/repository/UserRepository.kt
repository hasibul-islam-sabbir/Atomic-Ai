package com.atomicai.data.repository

import com.atomicai.data.local.UserDao
import com.atomicai.data.model.User
import kotlinx.coroutines.flow.Flow

class UserRepository(private val userDao: UserDao) {
    val user: Flow<User?> = userDao.getUser()

    suspend fun saveUser(user: User): Long {
        return userDao.insertOrUpdateUser(user)
    }

    suspend fun updateUser(user: User) {
        userDao.updateUser(user)
    }

    suspend fun deleteUser(user: User) {
        userDao.deleteUser(user)
    }
}

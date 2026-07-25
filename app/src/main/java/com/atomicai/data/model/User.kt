package com.atomicai.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val identityStatements: List<String> = emptyList(),
    val createdAt: Long = System.currentTimeMillis()
)

package com.atomicai.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "reflections")
data class Reflection(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val weekStartDate: String, // Format: YYYY-MM-DD
    val summary: String,
    val aiInsight: String
)

package com.atomicai.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "habits")
data class Habit(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val name: String,
    val type: HabitType,
    val stackAnchor: String? = null,
    val twoMinuteVersion: String = "",
    val environmentCue: String = "",
    val lawFocus: LawFocus = LawFocus.OBVIOUS,
    val frictionPlan: String? = null,
    val cravingRedirect: String? = null,
    val accountabilityNote: String? = null
)

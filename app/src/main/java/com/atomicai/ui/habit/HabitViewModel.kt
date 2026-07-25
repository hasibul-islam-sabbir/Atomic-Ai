package com.atomicai.ui.habit

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.atomicai.data.model.Habit
import com.atomicai.data.model.HabitType
import com.atomicai.data.model.LawFocus
import com.atomicai.data.repository.HabitRepository
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class HabitViewModel(private val repository: HabitRepository) : ViewModel() {

    val buildHabits: StateFlow<List<Habit>> = repository.getHabitsByType(HabitType.BUILD)
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    val breakHabits: StateFlow<List<Habit>> = repository.getHabitsByType(HabitType.BREAK)
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun saveHabit(
        id: Long = 0,
        name: String,
        stackAnchor: String,
        twoMinuteVersion: String,
        environmentCue: String,
        lawFocus: LawFocus = LawFocus.OBVIOUS
    ) {
        viewModelScope.launch {
            val habit = Habit(
                id = id,
                name = name.trim(),
                type = HabitType.BUILD,
                stackAnchor = stackAnchor.trim(),
                twoMinuteVersion = twoMinuteVersion.trim(),
                environmentCue = environmentCue.trim(),
                lawFocus = lawFocus
            )
            if (id > 0) {
                repository.updateHabit(habit)
            } else {
                repository.insertHabit(habit)
            }
        }
    }

    fun saveBadHabit(
        id: Long = 0,
        name: String,
        frictionPlan: String,
        cravingRedirect: String,
        accountabilityNote: String
    ) {
        viewModelScope.launch {
            val habit = Habit(
                id = id,
                name = name.trim(),
                type = HabitType.BREAK,
                frictionPlan = frictionPlan.trim(),
                cravingRedirect = cravingRedirect.trim(),
                accountabilityNote = accountabilityNote.trim(),
                lawFocus = LawFocus.INVISIBLE
            )
            if (id > 0) {
                repository.updateHabit(habit)
            } else {
                repository.insertHabit(habit)
            }
        }
    }

    fun deleteHabit(habit: Habit) {
        viewModelScope.launch {
            repository.deleteHabit(habit)
        }
    }
}

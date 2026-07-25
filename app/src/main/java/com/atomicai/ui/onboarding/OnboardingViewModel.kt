package com.atomicai.ui.onboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.atomicai.data.model.Habit
import com.atomicai.data.model.HabitType
import com.atomicai.data.model.LawFocus
import com.atomicai.data.model.User
import com.atomicai.data.repository.HabitRepository
import com.atomicai.data.repository.UserRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ScorecardItem(
    val id: Int,
    val title: String,
    val rating: String? = null // "+", "-", "="
)

data class OnboardingUiState(
    val identityStatements: List<String> = listOf(
        "আমি একজন স্বাস্থ্য সচেতন ও কর্মঠ মানুষ",
        "আমি একজন শৃঙ্খলিত ও প্রোডাক্টভ ব্যক্তি",
        "আমি একজন নিয়মিত পাঠক ও আজীবন শিক্ষার্থী"
    ),
    val scorecardItems: List<ScorecardItem> = listOf(
        ScorecardItem(1, "সকালে নির্দিষ্ট সময়ে ঘুম থেকে ওঠা"),
        ScorecardItem(2, "বিছানায় শুয়ে ১ ঘণ্টা ফোন চেক করা"),
        ScorecardItem(3, "এক গ্লাস বিশুদ্ধ পানি পান করা"),
        ScorecardItem(4, "পুষ্টিকর প্রাতরাশ/নাস্তা করা"),
        ScorecardItem(5, "১৫ মিনিট ব্যায়াম বা মেডিটেশন"),
        ScorecardItem(6, "কাজে বসার আগে সোশ্যাল মিডিয়া স্ক্রোলিং"),
        ScorecardItem(7, "দিনের গুরুত্বপূর্ণ ৩টি কাজের পরিকল্পনা করা"),
        ScorecardItem(8, "অতিরিক্ত চা বা কফি পান করা"),
        ScorecardItem(9, "রাত জেগে ভিডিও দেখা বা গেম খেলা"),
        ScorecardItem(10, "ঠিক সময়ে রাতে ঘুমাতে যাওয়া")
    ),
    val badHabits: List<String> = listOf(
        "কাজের মাঝে বারবার সোশ্যাল মিডিয়া চেক করা",
        "রাতে ঘুমানোর আগে অতিরিক্ত মোবাইল ব্যবহার",
        "অসময়ে আনহেলদি ফাস্টফুড খাওয়া"
    ),
    val currentStep: Int = 1,
    val isOnboardingComplete: Boolean = false
)

class OnboardingViewModel(
    private val userRepository: UserRepository,
    private val habitRepository: HabitRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(OnboardingUiState())
    val uiState: StateFlow<OnboardingUiState> = _uiState.asStateFlow()

    fun updateIdentityStatements(statements: List<String>) {
        _uiState.value = _uiState.value.copy(identityStatements = statements)
    }

    fun updateScorecardRating(id: Int, rating: String) {
        val updatedList = _uiState.value.scorecardItems.map { item ->
            if (item.id == id) {
                item.copy(rating = if (item.rating == rating) null else rating)
            } else item
        }
        _uiState.value = _uiState.value.copy(scorecardItems = updatedList)
    }

    fun updateBadHabits(badHabits: List<String>) {
        _uiState.value = _uiState.value.copy(badHabits = badHabits)
    }

    fun nextStep() {
        if (_uiState.value.currentStep < 3) {
            _uiState.value = _uiState.value.copy(currentStep = _uiState.value.currentStep + 1)
        }
    }

    fun previousStep() {
        if (_uiState.value.currentStep > 1) {
            _uiState.value = _uiState.value.copy(currentStep = _uiState.value.currentStep - 1)
        }
    }

    fun finishOnboarding(onSuccess: () -> Unit) {
        viewModelScope.launch {
            val state = _uiState.value

            // 1. Save User Profile Entity
            val user = User(
                identityStatements = state.identityStatements.filter { it.isNotBlank() }
            )
            userRepository.saveUser(user)

            // 2. Save Bad Habits as Habit Entities
            state.badHabits.filter { it.isNotBlank() }.forEach { habitName ->
                val habit = Habit(
                    name = habitName,
                    type = HabitType.BREAK,
                    twoMinuteVersion = "১ মিনিট সচেতন থাকা",
                    environmentCue = "ট্রিগার চেনা",
                    lawFocus = LawFocus.INVISIBLE
                )
                habitRepository.insertHabit(habit)
            }

            _uiState.value = _uiState.value.copy(isOnboardingComplete = true)
            onSuccess()
        }
    }
}

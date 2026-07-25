package com.atomicai.ui.onboarding

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

@Composable
fun OnboardingNavHost(
    viewModel: OnboardingViewModel,
    onNavigateToHome: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    when (uiState.currentStep) {
        1 -> IdentityScreen(
            initialStatements = uiState.identityStatements,
            onNext = { statements ->
                viewModel.updateIdentityStatements(statements)
                viewModel.nextStep()
            }
        )

        2 -> HabitScorecardScreen(
            items = uiState.scorecardItems,
            onRatingChange = { id, rating ->
                viewModel.updateScorecardRating(id, rating)
            },
            onNext = {
                viewModel.nextStep()
            },
            onBack = {
                viewModel.previousStep()
            }
        )

        3 -> BadHabitSelectionScreen(
            initialBadHabits = uiState.badHabits,
            onFinish = { badHabits ->
                viewModel.updateBadHabits(badHabits)
                viewModel.finishOnboarding {
                    onNavigateToHome()
                }
            },
            onBack = {
                viewModel.previousStep()
            }
        )
    }
}

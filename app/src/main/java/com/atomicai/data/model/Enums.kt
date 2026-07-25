package com.atomicai.data.model

enum class HabitType {
    BUILD,
    BREAK
}

enum class LawFocus {
    // 4 Laws of Behavior Change for BUILD habits
    OBVIOUS,        // 1st Law: Make it obvious
    ATTRACTIVE,     // 2nd Law: Make it attractive
    EASY,           // 3rd Law: Make it easy
    SATISFYING,     // 4th Law: Make it satisfying

    // Inverted 4 Laws for BREAK habits
    INVISIBLE,      // Inversion of 1st Law: Make it invisible
    UNATTRACTIVE,   // Inversion of 2nd Law: Make it unattractive
    DIFFICULT,      // Inversion of 3rd Law: Make it difficult
    UNSATISFYING    // Inversion of 4th Law: Make it unsatisfying
}

enum class CheckInStatus {
    DONE,
    MISSED,
    PARTIAL
}

enum class ConversationType {
    DAILY,
    WEEKLY
}

enum class MessageSender {
    USER,
    AI
}

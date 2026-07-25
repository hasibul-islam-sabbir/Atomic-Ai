package com.atomicai.ui.habit

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.atomicai.data.model.Habit
import kotlinx.coroutines.delay

@Composable
fun UrgeTimerDialog(
    badHabits: List<Habit>,
    onDismiss: () => Unit
) {
    var selectedHabit by remember { mutableStateOf<Habit?>(badHabits.firstOrNull()) }
    var timeLeft by remember { mutableStateOf(60) }
    var isActive by remember { mutableStateOf(false) }
    var isCompleted by remember { mutableStateOf(false) }

    LaunchedEffect(isActive, timeLeft) {
        if (isActive && timeLeft > 0) {
            delay(1000L)
            timeLeft -= 1
        } else if (isActive && timeLeft == 0) {
            isActive = false
            isCompleted = true
        }
    }

    val darkBg = Color(0xFF173834)
    val inputBg = Color(0xFF0F2623)
    val accentColor = Color(0xFF2DD4BF)
    val amberColor = Color(0xFFFFB74D)
    val borderColor = Color(0xFF2B5852)
    val textColor = Color(0xFFF0F7F5)
    val subTextColor = Color(0xFFA3C2BB)

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = darkBg,
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
                .border(1.dp, borderColor, RoundedCornerShape(24.dp))
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Top Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "⚡ URGE SURFING (তাড়না জয়)",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = amberColor
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = subTextColor)
                    }
                }

                if (badHabits.isEmpty()) {
                    Text("কোনো বদঅভ্যাস সেটআপ করা নেই", color = textColor, fontSize = 14.sp)
                } else if (!isActive && !isCompleted && timeLeft == 60) {
                    // Habit Selection
                    Text(
                        text = "কোন বদঅভ্যাসের তাড়না পাচ্ছেন?",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = textColor
                    )

                    LazyColumn(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 220.dp)
                    ) {
                        items(badHabits) { habit ->
                            Surface(
                                color = inputBg,
                                shape = RoundedCornerShape(12.dp),
                                border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedHabit = habit
                                        timeLeft = 60
                                        isActive = true
                                    }
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(habit.name, color = textColor, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Text(
                                        "⚡ ${habit.cravingRedirect ?: "৬০ সেকেন্ড শ্বাসের ব্যায়াম"}",
                                        color = accentColor,
                                        fontSize = 12.sp
                                    )
                                }
                            }
                        }
                    }
                } else if (isCompleted) {
                    // Completion Victory
                    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("🎉 তাড়নাকে জয় করেছেন!", color = accentColor, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text(
                            "আপনি সফলভাবে ৬০ সেকেন্ডের ক্র্যাভিং রিডাইরেক্ট সম্পন্ন করেছেন।",
                            color = subTextColor,
                            fontSize = 12.sp
                        )
                        Button(
                            onClick = onDismiss,
                            colors = ButtonDefaults.buttonColors(containerColor = accentColor, contentColor = Color(0xFF0F2623)),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("ফিরে যান", fontWeight = FontWeight.Bold)
                        }
                    }
                } else {
                    // Active Countdown Timer
                    selectedHabit?.let { habit ->
                        Text(
                            text = habit.cravingRedirect ?: "৬০ সেকেন্ড শ্বাসের ব্যায়াম",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = textColor
                        )

                        // Timer Circle
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(140.dp)
                                .background(inputBg, CircleShape)
                                .border(4.dp, accentColor, CircleShape)
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("$timeLeft", fontSize = 36.sp, fontWeight = FontWeight.ExtraBold, color = textColor)
                                Text("সেকেন্ড باقی", fontSize = 11.sp, color = subTextColor)
                            }
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            IconButton(onClick = { timeLeft = 60; isActive = false }) {
                                Icon(Icons.Default.Refresh, contentDescription = "Reset", tint = subTextColor)
                            }

                            Button(
                                onClick = { isActive = !isActive },
                                colors = ButtonDefaults.buttonColors(containerColor = accentColor, contentColor = Color(0xFF0F2623)),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text(if (isActive) "পজ" else "শুরু", fontWeight = FontWeight.Bold)
                            }

                            Button(
                                onClick = { isCompleted = true; isActive = false },
                                colors = ButtonDefaults.buttonColors(containerColor = inputBg, contentColor = accentColor),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("শেষ")
                            }
                        }
                    }
                }
            }
        }
    }
}

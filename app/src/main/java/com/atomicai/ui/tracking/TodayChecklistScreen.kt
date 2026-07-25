package com.atomicai.ui.tracking

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.atomicai.data.model.CheckInStatus
import com.atomicai.data.model.Habit
import com.atomicai.data.model.HabitType

@Composable
fun TodayChecklistScreen(
    habits: List<Habit>,
    todayCheckIns: Map<Long, CheckInStatus>,
    yesterdayMissedIds: Set<Long>,
    onCheckIn: (habitId: Long, status: CheckInStatus) -> Unit
) {
    val darkBg = Color(0xFF173834)
    val inputBg = Color(0xFF0F2623)
    val accentColor = Color(0xFF2DD4BF)
    val amberColor = Color(0xFFFFB74D)
    val borderColor = Color(0xFF2B5852)
    val textColor = Color(0xFFF0F7F5)
    val subTextColor = Color(0xFFA3C2BB)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Surface(
            color = darkBg,
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "আজকের অভ্যাস চেকলিস্ট",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = textColor
                )
                Text(
                    text = "ছোট ছোট দৈনিক পদক্ষেপই দীর্ঘমেয়াদী সাফল্য এনে দেয়।",
                    fontSize = 12.sp,
                    color = subTextColor
                )
            }
        }

        if (habits.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Text("কোনো অভ্যাস যোগ করা হয়নি", color = subTextColor, fontSize = 14.sp)
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(habits) { habit ->
                    val status = todayCheckIns[habit.id]
                    val wasYesterdayMissed = yesterdayMissedIds.contains(habit.id)

                    Surface(
                        color = darkBg,
                        shape = RoundedCornerShape(16.dp),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (status == CheckInStatus.DONE) accentColor else if (wasYesterdayMissed) amberColor else borderColor
                        ),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            if (wasYesterdayMissed && status != CheckInStatus.DONE) {
                                Surface(
                                    color = amberColor.copy(alpha = 0.15f),
                                    shape = RoundedCornerShape(8.dp),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, amberColor.copy(alpha = 0.4f))
                                ) {
                                    Row(
                                        modifier = Modifier.padding(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Warning, contentDescription = null, tint = amberColor, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            "⚠️ Yesterday missed! 'Never miss twice' — ২-মিনিটের সংক্ষিপ্ত ভার্সন শেষ করুন।",
                                            fontSize = 11.sp,
                                            color = amberColor
                                        )
                                    }
                                }
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = if (habit.type == HabitType.BUILD) "BUILD" else "BREAK",
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (habit.type == HabitType.BUILD) accentColor else amberColor
                                    )
                                    Text(habit.name, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = textColor)
                                    if (habit.type == HabitType.BUILD) {
                                        Text("২-মিনিট ভার্সন: ${habit.twoMinuteVersion}", fontSize = 12.sp, color = subTextColor)
                                    } else {
                                        Text("রিডাইরেক্ট: ${habit.cravingRedirect ?: "৬০ সেকেন্ড সচেতন থাকা"}", fontSize = 12.sp, color = subTextColor)
                                    }
                                }

                                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Button(
                                        onClick = { onCheckIn(habit.id, CheckInStatus.DONE) },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (status == CheckInStatus.DONE) accentColor else inputBg,
                                            contentColor = if (status == CheckInStatus.DONE) Color(0xFF0F2623) else accentColor
                                        ),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Text("DONE", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }

                                    Button(
                                        onClick = { onCheckIn(habit.id, CheckInStatus.MISSED) },
                                        colors = ButtonDefaults.buttonColors(
                                            containerColor = if (status == CheckInStatus.MISSED) amberColor else inputBg,
                                            contentColor = if (status == CheckInStatus.MISSED) Color(0xFF0F2623) else amberColor
                                        ),
                                        shape = RoundedCornerShape(10.dp)
                                    ) {
                                        Text("MISSED", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            if (status == CheckInStatus.MISSED) {
                                Surface(
                                    color = inputBg,
                                    shape = RoundedCornerShape(10.dp),
                                    border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
                                ) {
                                    Text(
                                        text = if (habit.type == HabitType.BUILD)
                                            "ঠিক আছে, কাল আবার চেষ্টা করি — এই ২-মিনিট ভার্সনটা মনে আছে তো: '${habit.twoMinuteVersion}'?"
                                        else
                                            "ঠিক আছে, এটি শেখার অভিজ্ঞতা — কাল আবার ট্র্যাকে ফিরব! ক্র্যাভিং রিডাইরেক্ট: '${habit.cravingRedirect ?: habit.name}' প্রয়োগ করুন।",
                                        fontSize = 11.sp,
                                        color = textColor,
                                        modifier = Modifier.padding(10.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

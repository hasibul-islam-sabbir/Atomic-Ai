package com.atomicai.ui.habit

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Sparkles
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.atomicai.data.model.Habit
import com.atomicai.data.model.LawFocus

@Composable
fun HabitListScreen(
    viewModel: HabitViewModel,
    modifier: Modifier = Modifier
) {
    val habits by viewModel.buildHabits.collectAsState()
    var showDialog by remember { mutableStateOf(false) }
    var editingHabit by remember { mutableStateOf<Habit?>(null) }
    var deletingHabit by remember { mutableStateOf<Habit?>(null) }

    val darkBg = Color(0xFF0F2623)
    val cardBg = Color(0xFF173834)
    val accentColor = Color(0xFF2DD4BF)
    val borderColor = Color(0xFF2B5852)
    val textColor = Color(0xFFF0F7F5)
    val subTextColor = Color(0xFFA3C2BB)

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(darkBg)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Header
            Surface(
                color = cardBg,
                shape = RoundedCornerShape(16.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.Sparkles,
                                contentDescription = null,
                                tint = accentColor,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "ভালো অভ্যাস ম্যানেজার (BUILD)",
                                color = accentColor,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "আপনার গঠনমূলক অভ্যাসসমূহ",
                            color = textColor,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Button(
                        onClick = {
                            editingHabit = null
                            showDialog = true
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = accentColor,
                            contentColor = Color(0xFF0F2623)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("নতুন অভ্যাস", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Habit Cards List
            if (habits.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "এখনো কোনো ভালো অভ্যাস যোগ করেননি",
                            color = textColor,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "উপরে 'নতুন অভ্যাস' বাটনে ট্যাপ করে শুরু করুন",
                            color = subTextColor,
                            fontSize = 12.sp
                        )
                    }
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(habits, key = { it.id }) { habit ->
                        HabitCard(
                            habit = habit,
                            onEdit = {
                                editingHabit = habit
                                showDialog = true
                            },
                            onDelete = {
                                deletingHabit = habit
                            }
                        )
                    }
                }
            }
        }

        // Add / Edit Dialog
        if (showDialog) {
            AddHabitDialog(
                editingHabit = editingHabit,
                onDismiss = { showDialog = false },
                onSave = { id, name, anchor, twoMin, envCue, lawFocus ->
                    viewModel.saveHabit(id, name, anchor, twoMin, envCue, lawFocus)
                }
            )
        }

        // Delete Confirmation Dialog
        deletingHabit?.let { habitToDelete ->
            AlertDialog(
                onDismissRequest = { deletingHabit = null },
                title = { Text("অভ্যাস ডিলিট করবেন?", color = textColor, fontWeight = FontWeight.Bold) },
                text = { Text("আপনি কি নিশ্চিত যে \"${habitToDelete.name}\" মুছে ফেলতে চান?", color = subTextColor, fontSize = 13.sp) },
                confirmButton = {
                    TextButton(
                        onClick = {
                            viewModel.deleteHabit(habitToDelete)
                            deletingHabit = null
                        }
                    ) {
                        Text("ডিলিট করুন", color = Color(0xFFEF4444), fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { deletingHabit = null }) {
                        Text("বাতিল", color = subTextColor)
                    }
                },
                containerColor = cardBg
            )
        }
    }
}

@Composable
fun HabitCard(
    habit: Habit,
    onEdit: () -> Unit,
    onDelete: () -> Unit
) {
    val cardBg = Color(0xFF173834)
    val innerBg = Color(0xFF0F2623)
    val accentColor = Color(0xFF2DD4BF)
    val borderColor = Color(0xFF2B5852)
    val textColor = Color(0xFFF0F7F5)
    val subTextColor = Color(0xFFA3C2BB)

    Surface(
        color = cardBg,
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Header Row: Name & Action Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = habit.name,
                        color = textColor,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Surface(
                        color = Color(0xFF1D443F),
                        shape = CircleShape,
                        border = androidx.compose.foundation.BorderStroke(1.dp, borderColor)
                    ) {
                        Text(
                            text = if (habit.lawFocus == LawFocus.OBVIOUS) "১ম আইন: OBVIOUS" else "৩য় আইন: EASY",
                            color = accentColor,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    IconButton(onClick = onEdit, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Edit, contentDescription = "Edit", tint = subTextColor, modifier = Modifier.size(16.dp))
                    }
                    IconButton(onClick = onDelete, modifier = Modifier.size(32.dp)) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFEF4444), modifier = Modifier.size(16.dp))
                    }
                }
            }

            // Details Container
            Surface(
                color = innerBg,
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(10.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    habit.stackAnchor?.let { anchor ->
                        Text(
                            text = "🔗 স্ট্যাক এঙ্কর: \"$anchor\"-এর পর",
                            color = textColor,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Text(
                        text = "⚡ ২-মিনিট ভার্সন: ${habit.twoMinuteVersion}",
                        color = Color(0xFFFFD54F),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )

                    if (habit.environmentCue.isNotBlank()) {
                        Text(
                            text = "🌱 পরিবেশ প্রস্তুতি: ${habit.environmentCue}",
                            color = subTextColor,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }
    }
}

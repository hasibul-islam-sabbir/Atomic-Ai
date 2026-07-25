package com.atomicai.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun BadHabitSelectionScreen(
    initialBadHabits: List<String>,
    onFinish: (List<String>) -> Unit,
    onBack: () -> Unit
) {
    var badHabits by remember { mutableStateOf(initialBadHabits.ifEmpty { listOf("") }) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(WisemindBg)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Surface(
            color = Color(0xFF1D443F),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, WisemindBorder)
        ) {
            Text(
                text = "ধাপ ৩ অফ ৩: বদঅভ্যাস চিহ্নিতকরণ",
                color = WisemindTeal,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "যে অভ্যাসগুলো বাদ দিতে চাও",
            color = WisemindTextPrimary,
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Atomic Habits-এর ইনভার্স ৪টি সূত্র প্রয়োগ করে এই অভ্যাসগুলো দূর করতে আমরা সাহায্য করব।",
            color = WisemindTextSecondary,
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp
        )

        Spacer(modifier = Modifier.height(24.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            itemsIndexed(badHabits) { index, habit ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .background(WisemindSurface, RoundedCornerShape(8.dp))
                            .border(1.dp, WisemindBorder, RoundedCornerShape(8.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${index + 1}",
                            color = Color(0xFFF59E0B),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    OutlinedTextField(
                        value = habit,
                        onValueChange = { newValue ->
                            val updated = badHabits.toMutableList()
                            updated[index] = newValue
                            badHabits = updated
                            errorMessage = null
                        },
                        placeholder = { Text("উদাহরণ: 'সোশ্যাল মিডিয়ায় সময় নষ্ট'", color = Color(0xFF608780)) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = WisemindSurface,
                            unfocusedContainerColor = WisemindSurface,
                            focusedBorderColor = WisemindTeal,
                            unfocusedBorderColor = WisemindBorder,
                            focusedTextColor = WisemindTextPrimary,
                            unfocusedTextColor = WisemindTextPrimary
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    )

                    if (badHabits.size > 1) {
                        IconButton(onClick = {
                            badHabits = badHabits.filterIndexed { i, _ -> i != index }
                        }) {
                            Text("✕", color = Color.Red, fontSize = 16.sp)
                        }
                    }
                }
            }

            item {
                if (badHabits.size < 5) {
                    OutlinedButton(
                        onClick = { badHabits = badHabits + "" },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, WisemindBorder)
                    ) {
                        Text("+ নতুন বদঅভ্যাস যোগ করুন", color = WisemindTeal)
                    }
                }
            }
        }

        errorMessage?.let {
            Text(text = it, color = Color.Red, fontSize = 12.sp, modifier = Modifier.padding(vertical = 4.dp))
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onBack,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, WisemindBorder)
            ) {
                Text("← পেছনে", color = WisemindTextSecondary)
            }

            Button(
                onClick = {
                    val valid = badHabits.map { it.trim() }.filter { it.isNotEmpty() }
                    if (valid.size < 3) {
                        errorMessage = "কমপক্ষে ৩টি বদঅভ্যাস লিখুন"
                    } else {
                        onFinish(valid)
                    }
                },
                modifier = Modifier
                    .weight(2f)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = WisemindTeal),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("শেষ করো ✓", color = WisemindBg, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

package com.atomicai.ui.habit

import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
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

val PresetCravingRedirects = listOf(
    "৬০ সেকেন্ড গভীর শ্বাসের ব্যায়াম",
    "১ মিনিট দ্রুত হাঁটা বা স্ট্রেচিং",
    "১ গ্লাস ঠাণ্ডা পানি ধীরগতিতে খাওয়া",
    "নিজের Identity Statement সশব্দে পড়া",
    "কাস্টম অ্যাকশন লিখুন..."
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddBadHabitDialog(
    editingHabit: Habit? = null,
    onDismiss: () => Unit,
    onSave: (
        id: Long,
        name: String,
        frictionPlan: String,
        cravingRedirect: String,
        accountabilityNote: String
    ) -> Unit
) {
    var name by remember { mutableStateOf(editingHabit?.name ?: "") }
    var frictionPlan by remember { mutableStateOf(editingHabit?.frictionPlan ?: "") }
    var selectedRedirect by remember {
        mutableStateOf(
            editingHabit?.cravingRedirect?.let {
                if (PresetCravingRedirects.contains(it)) it else "কাস্টম অ্যাকশন লিখুন..."
            } ?: PresetCravingRedirects[0]
        )
    }
    var customRedirect by remember {
        mutableStateOf(
            editingHabit?.cravingRedirect?.let {
                if (!PresetCravingRedirects.contains(it)) it else ""
            } ?: ""
        )
    }
    var accountabilityNote by remember { mutableStateOf(editingHabit?.accountabilityNote ?: "") }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val darkBg = Color(0xFF173834)
    val inputBg = Color(0xFF0F2623)
    val accentColor = Color(0xFFFFB74D) // Amber/Gold accent for Break
    val borderColor = Color(0xFF2B5852)
    val textColor = Color(0xFFF0F7F5)
    val subTextColor = Color(0xFFA3C2BB)

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = darkBg,
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp)
                .border(1.dp, borderColor, RoundedCornerShape(20.dp))
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (editingHabit != null) "বদঅভ্যাস ফ্লো এডিট" else "বদঅভ্যাস রোধ ফ্লো (BREAK)",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = textColor
                        )
                        Text(
                            text = "Atomic Habits: ৩য় আইন - কঠিন করা",
                            fontSize = 11.sp,
                            color = subTextColor
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close", tint = subTextColor)
                    }
                }

                Divider(color = borderColor)

                // 1. Habit Name
                Column {
                    Text("১. বদঅভ্যাসের নাম *", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = subTextColor)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it; errorMessage = null },
                        placeholder = { Text("যেমন: গভীর রাতে ফোন চালানো", color = Color(0xFF608780), fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = inputBg,
                            unfocusedContainerColor = inputBg,
                            focusedBorderColor = accentColor,
                            unfocusedBorderColor = borderColor,
                            focusedTextColor = textColor,
                            unfocusedTextColor = textColor
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                // 2. Friction Plan
                Column {
                    Text("২. ফ্রিকশন প্ল্যান (Friction Plan)", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = subTextColor)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = frictionPlan,
                        onValueChange = { frictionPlan = it },
                        placeholder = { Text("যেমন: ফোন অন্য রুমে চার্জে রাখব", color = Color(0xFF608780), fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = inputBg,
                            unfocusedContainerColor = inputBg,
                            focusedBorderColor = accentColor,
                            unfocusedBorderColor = borderColor,
                            focusedTextColor = textColor,
                            unfocusedTextColor = textColor
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                // 3. Craving Redirect
                Column {
                    Text("৩. ক্র্যাভিং রিডাইরেক্ট (Craving Redirect) *", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = subTextColor)
                    Spacer(modifier = Modifier.height(4.dp))
                    PresetCravingRedirects.forEach { option ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedRedirect = option }
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(
                                selected = (selectedRedirect == option),
                                onClick = { selectedRedirect = option },
                                colors = RadioButtonDefaults.colors(selectedColor = accentColor)
                            )
                            Text(option, color = textColor, fontSize = 13.sp)
                        }
                    }

                    if (selectedRedirect == "কাস্টম অ্যাকশন লিখুন...") {
                        OutlinedTextField(
                            value = customRedirect,
                            onValueChange = { customRedirect = it },
                            placeholder = { Text("কাস্টম মাইক্রো-অ্যাকশন লিখুন", color = Color(0xFF608780), fontSize = 13.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = inputBg,
                                unfocusedContainerColor = inputBg,
                                focusedBorderColor = accentColor,
                                unfocusedBorderColor = borderColor,
                                focusedTextColor = textColor,
                                unfocusedTextColor = textColor
                            ),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }
                }

                // 4. Accountability Note
                Column {
                    Text("৪. অ্যাকাউন্টেবিলিটি নোট", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = subTextColor)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = accountabilityNote,
                        onValueChange = { accountabilityNote = it },
                        placeholder = { Text("যেমন: ১০টি পুশআপ দেব", color = Color(0xFF608780), fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = inputBg,
                            unfocusedContainerColor = inputBg,
                            focusedBorderColor = accentColor,
                            unfocusedBorderColor = borderColor,
                            focusedTextColor = textColor,
                            unfocusedTextColor = textColor
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                errorMessage?.let { err ->
                    Text(err, color = Color(0xFFEF4444), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("বাতিল", color = subTextColor)
                    }

                    Button(
                        onClick = {
                            if (name.isBlank()) {
                                errorMessage = "বদঅভ্যাসের নাম আবশ্যক"
                                return@Button
                            }
                            val finalRedirect = if (selectedRedirect == "কাস্টম অ্যাকশন লিখুন...") customRedirect else selectedRedirect
                            if (finalRedirect.isBlank()) {
                                errorMessage = "ক্র্যাভিং রিডাইরেক্ট সিলেক্ট করুন"
                                return@Button
                            }
                            onSave(
                                editingHabit?.id ?: 0L,
                                name,
                                frictionPlan,
                                finalRedirect,
                                accountabilityNote
                            )
                            onDismiss()
                        },
                        modifier = Modifier.weight(1.5f),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = accentColor, contentColor = Color(0xFF0F2623))
                    ) {
                        Text("সেভ করুন", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

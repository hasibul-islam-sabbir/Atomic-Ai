package com.atomicai.ui.habit

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lightbulb
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
import com.atomicai.data.model.LawFocus

val PresetStackAnchors = listOf(
    "সকালে ঘুম থেকে ওঠার পর",
    "ফজর / সকালের প্রার্থনার পর",
    "সকালের নাস্তা করার পর",
    "দাঁত ব্রাশ করার পর",
    "কাজের ডেস্কে বসার পর",
    "দুপুরের খাবার খাওয়ার পর",
    "সন্ধ্যায় বাসায় ফেরার পর",
    "রাতের খাবার খাওয়ার পর",
    "বিছানায় ঘুমাতে যাওয়ার আগে",
    "কাস্টম এঙ্কর লিখুন..."
)

val TwoMinuteSuggestions = mapOf(
    "পড়া" to "১ পৃষ্ঠা বই পড়া",
    "বই" to "১ পৃষ্ঠা বই পড়া",
    "ব্যায়াম" to "২টি পুশআপ বা ১ মিনিট স্ট্রেচ করা",
    "মেডিটেশন" to "২ মিনিট চোখ বন্ধ করে রাখা",
    "লেখা" to "মাত্র ১টি বাক্য লেখা",
    "পানি" to "১ গ্লাস বিশুদ্ধ পানি পান করা",
    "হাঁটা" to "২ মিনিট হাঁটা"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddHabitDialog(
    editingHabit: Habit? = null,
    onDismiss: () => Unit,
    onSave: (
        id: Long,
        name: String,
        stackAnchor: String,
        twoMinuteVersion: String,
        environmentCue: String,
        lawFocus: LawFocus
    ) -> Unit
) {
    var name by remember { mutableStateOf(editingHabit?.name ?: "") }
    var selectedAnchor by remember {
        mutableStateOf(
            editingHabit?.stackAnchor?.let {
                if (PresetStackAnchors.contains(it)) it else "কাস্টম এঙ্কর লিখুন..."
            } ?: PresetStackAnchors[0]
        )
    }
    var customAnchor by remember {
        mutableStateOf(
            editingHabit?.stackAnchor?.let {
                if (!PresetStackAnchors.contains(it)) it else ""
            } ?: ""
        )
    }
    var twoMinuteVersion by remember { mutableStateOf(editingHabit?.twoMinuteVersion ?: "") }
    var environmentCue by remember { mutableStateOf(editingHabit?.environmentCue ?: "") }
    var lawFocus by remember { mutableStateOf(editingHabit?.lawFocus ?: LawFocus.OBVIOUS) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var dropdownExpanded by remember { mutableStateOf(false) }

    val activeSuggestion = remember(name) {
        if (name.isBlank()) null
        else {
            val matchedKey = TwoMinuteSuggestions.keys.find { name.contains(it) }
            matchedKey?.let { TwoMinuteSuggestions[it] }
                ?: "২ মিনিটে ${name.trim()}-এর প্রথম ধাপ শেষ করা"
        }
    }

    val darkBg = Color(0xFF173834)
    val inputBg = Color(0xFF0F2623)
    val accentColor = Color(0xFF2DD4BF)
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
                // Title Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (editingHabit != null) "অভ্যাস এডিট করুন" else "নতুন ভালো অভ্যাস গড়ুন (BUILD)",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = textColor
                        )
                        Text(
                            text = "Atomic Habits-এর আলোকে সেটআপ",
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
                    Text(
                        text = "১. অভ্যাসের নাম (Habit Name) *",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = subTextColor
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = name,
                        onValueChange = {
                            name = it
                            errorMessage = null
                        },
                        placeholder = { Text("যেমন: বই পড়া, নিয়মিত ব্যায়াম করা", color = Color(0xFF608780), fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = inputBg,
                            unfocusedContainerColor = inputBg,
                            focusedBorderColor = accentColor,
                            unfocusedBorderColor = borderColor,
                            focusedTextColor = textColor,
                            unfocusedTextColor = textColor
                        ),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )
                }

                // 2. Habit Stacking
                Column {
                    Text(
                        text = "২. হ্যাবিট স্ট্যাকিং (Stack Anchor Routine) *",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = subTextColor
                    )
                    Text(
                        text = "[বর্তমান অভ্যাস]-এর পর আমি [${if (name.isBlank()) "নতুন অভ্যাস" else name}] করব।",
                        fontSize = 11.sp,
                        color = Color(0xFF81A8A0)
                    )
                    Spacer(modifier = Modifier.height(4.dp))

                    Box {
                        OutlinedTextField(
                            value = selectedAnchor,
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = {
                                Icon(
                                    Icons.Default.ArrowDropDown,
                                    contentDescription = null,
                                    tint = accentColor,
                                    modifier = Modifier.clickable { dropdownExpanded = !dropdownExpanded }
                                )
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { dropdownExpanded = !dropdownExpanded },
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

                        DropdownMenu(
                            expanded = dropdownExpanded,
                            onDismissRequest = { dropdownExpanded = false },
                            modifier = Modifier.background(inputBg)
                        ) {
                            PresetStackAnchors.forEach { option ->
                                DropdownMenuItem(
                                    text = { Text(option, color = textColor, fontSize = 13.sp) },
                                    onClick = {
                                        selectedAnchor = option
                                        dropdownExpanded = false
                                    }
                                )
                            }
                        }
                    }

                    if (selectedAnchor == "কাস্টম এঙ্কর লিখুন...") {
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = customAnchor,
                            onValueChange = { customAnchor = it },
                            placeholder = { Text("আপনার নিজস্ব রুটিন লিখুন", color = Color(0xFF608780), fontSize = 13.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = inputBg,
                                unfocusedContainerColor = inputBg,
                                focusedBorderColor = accentColor,
                                unfocusedBorderColor = borderColor,
                                focusedTextColor = textColor,
                                unfocusedTextColor = textColor
                            ),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                    }
                }

                // 3. 2-Minute Rule Wizard
                Column {
                    Text(
                        text = "৩. ২-মিনিট রুল ভার্সন (2-Minute Version) *",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = subTextColor
                    )

                    activeSuggestion?.let { suggestion ->
                        Spacer(modifier = Modifier.height(4.dp))
                        Surface(
                            color = inputBg,
                            shape = RoundedCornerShape(10.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, borderColor),
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { twoMinuteVersion = suggestion }
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Lightbulb, contentDescription = null, tint = Color(0xFFFFC107), modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "💡 উইজার্ড সাজেশন: \"$suggestion\" (ক্লিক করুন)",
                                    fontSize = 11.sp,
                                    color = accentColor,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = twoMinuteVersion,
                        onValueChange = { twoMinuteVersion = it },
                        placeholder = { Text("যেমন: মাত্র ১ পৃষ্ঠা পড়া", color = Color(0xFF608780), fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = inputBg,
                            unfocusedContainerColor = inputBg,
                            focusedBorderColor = accentColor,
                            unfocusedBorderColor = borderColor,
                            focusedTextColor = textColor,
                            unfocusedTextColor = textColor
                        ),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )
                }

                // 4. Environment Cue
                Column {
                    Text(
                        text = "৪. পরিবেশ প্রস্তুতি (Environment Cue)",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = subTextColor
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = environmentCue,
                        onValueChange = { environmentCue = it },
                        placeholder = { Text("যেমন: বইটি রাতে বালিশের কাছে রেখে দেব", color = Color(0xFF608780), fontSize = 13.sp) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = inputBg,
                            unfocusedContainerColor = inputBg,
                            focusedBorderColor = accentColor,
                            unfocusedBorderColor = borderColor,
                            focusedTextColor = textColor,
                            unfocusedTextColor = textColor
                        ),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )
                }

                // 5. Law Focus Tag
                Column {
                    Text(
                        text = "৫. মূল আইন ও ফোকাস ট্যাগ",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = subTextColor
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Button(
                            onClick = { lawFocus = LawFocus.OBVIOUS },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (lawFocus == LawFocus.OBVIOUS) accentColor else inputBg
                            ),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = "OBVIOUS",
                                color = if (lawFocus == LawFocus.OBVIOUS) Color(0xFF0F2623) else subTextColor,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Button(
                            onClick = { lawFocus = LawFocus.EASY },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (lawFocus == LawFocus.EASY) Color(0xFF10B981) else inputBg
                            ),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = "EASY",
                                color = if (lawFocus == LawFocus.EASY) Color(0xFF0F2623) else subTextColor,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                errorMessage?.let { err ->
                    Text(err, color = Color(0xFFEF4444), fontSize = 12.sp, fontWeight = FontWeight.Medium)
                }

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = subTextColor)
                    ) {
                        Text("বাতিল")
                    }

                    Button(
                        onClick = {
                            if (name.isBlank()) {
                                errorMessage = "অভ্যাসের নাম আবশ্যক"
                                return@Button
                            }
                            val finalAnchor = if (selectedAnchor == "কাস্টম এঙ্কর লিখুন...") customAnchor else selectedAnchor
                            if (finalAnchor.isBlank()) {
                                errorMessage = "একটি স্ট্যাক এঙ্কর বেছে নিন"
                                return@Button
                            }
                            if (twoMinuteVersion.isBlank()) {
                                errorMessage = "২-মিনিট ভার্সন আবশ্যক"
                                return@Button
                            }
                            onSave(
                                editingHabit?.id ?: 0L,
                                name,
                                finalAnchor,
                                twoMinuteVersion,
                                if (environmentCue.isBlank()) "পরিবেশ প্রস্তুত রাখা" else environmentCue,
                                lawFocus
                            )
                            onDismiss()
                        },
                        modifier = Modifier.weight(1.5f),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = accentColor,
                            contentColor = Color(0xFF0F2623)
                        )
                    ) {
                        Text(if (editingHabit != null) "আপডেট সেভ" else "অভ্যাস সেভ করুন", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

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

// Wisemind Theme Colors
val WisemindBg = Color(0xFF0F2623)
val WisemindSurface = Color(0xFF173834)
val WisemindBorder = Color(0xFF2B5852)
val WisemindTeal = Color(0xFF2DD4BF)
val WisemindTextPrimary = Color(0xFFF0F7F5)
val WisemindTextSecondary = Color(0xFFA3C2BB)

@Composable
fun IdentityScreen(
    initialStatements: List<String>,
    onNext: (List<String>) -> Unit
) {
    var statements by remember { mutableStateOf(initialStatements.ifEmpty { listOf("") }) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(WisemindBg)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Tag Header
        Surface(
            color = Color(0xFF1D443F),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, WisemindBorder)
        ) {
            Text(
                text = "ধাপ ১ অফ ৩: আত্মপরিচয়",
                color = WisemindTeal,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "তুমি কে হতে চাও?",
            color = WisemindTextPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Atomic Habits-এর মূলনীতি: অভ্যাস পরিবর্তনের সেরা উপায় হলো নিজের আইডেন্টিটি পরিবর্তন করা।",
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
            itemsIndexed(statements) { index, statement ->
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
                            color = WisemindTeal,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    OutlinedTextField(
                        value = statement,
                        onValueChange = { newValue ->
                            val updated = statements.toMutableList()
                            updated[index] = newValue
                            statements = updated
                            errorMessage = null
                        },
                        placeholder = { Text("উদাহরণ: 'আমি একজন স্বাস্থ্য সচেতন মানুষ'", color = Color(0xFF608780)) },
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

                    if (statements.size > 1) {
                        IconButton(onClick = {
                            statements = statements.filterIndexed { i, _ -> i != index }
                        }) {
                            Text("✕", color = Color.Red, fontSize = 16.sp)
                        }
                    }
                }
            }

            item {
                if (statements.size < 5) {
                    OutlinedButton(
                        onClick = { statements = statements + "" },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, WisemindBorder)
                    ) {
                        Text("+ নতুন স্টেটমেন্ট যোগ করুন", color = WisemindTeal)
                    }
                }
            }
        }

        errorMessage?.let {
            Text(text = it, color = Color.Red, fontSize = 12.sp, modifier = Modifier.padding(vertical = 4.dp))
        }

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = {
                val valid = statements.map { it.trim() }.filter { it.isNotEmpty() }
                if (valid.size < 3) {
                    errorMessage = "কমপক্ষে ৩টি আইডেন্টিটি স্টেটমেন্ট লিখুন"
                } else {
                    onNext(valid)
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(containerColor = WisemindTeal),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("পরবর্তী ধাপ →", color = WisemindBg, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }
    }
}

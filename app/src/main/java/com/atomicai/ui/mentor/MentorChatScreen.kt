package com.atomicai.ui.mentor

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.atomicai.data.model.Message
import com.atomicai.data.model.MessageSender

@Composable
fun MentorChatScreen(
    messages: List<Message>,
    detectedPattern: String?,
    onSendMessage: (String) -> Unit,
    onAnalyzePattern: () -> Unit,
    modifier: Modifier = Modifier
) {
    var inputText by remember { mutableStateOf("") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFF0F2623))
            .padding(16.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "AtomicAI মেন্টর",
                    color = Color(0xFFF0F7F5),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Socratic Coach • Atomic Habits",
                    color = Color(0xFFA3C2BB),
                    fontSize = 12.sp
                )
            }

            Button(
                onClick = onAnalyzePattern,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF173834),
                    contentColor = Color(0xFF2DD4BF)
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("প্যাটার্ন ইনসাইট", fontSize = 12.sp)
            }
        }

        // Pattern Insight Banner if available
        if (!detectedPattern.isNullOrBlank()) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0x33F59E0B)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "🔍 শনাক্তকৃত অভ্যাসের প্যাটার্ন:",
                        color = Color(0xFFFBBF24),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = detectedPattern,
                        color = Color(0xFFF0F7F5),
                        fontSize = 13.sp
                    )
                }
            }
        }

        // Messages List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(messages) { msg ->
                val isAi = msg.sender == MessageSender.AI
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isAi) Arrangement.Start else Arrangement.End
                ) {
                    Surface(
                        color = if (isAi) Color(0xFF173834) else Color(0xFF2DD4BF),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.widthIn(max = 280.dp)
                    ) {
                        Text(
                            text = msg.text,
                            color = if (isAi) Color(0xFFF0F7F5) else Color(0xFF0F2623),
                            fontSize = 13.sp,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Input Field and Send Button
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text("মেন্টরকে প্রশ্ন করুন...", color = Color(0xFF608780), fontSize = 13.sp) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color(0xFF173834),
                    unfocusedContainerColor = Color(0xFF173834),
                    focusedBorderColor = Color(0xFF2DD4BF),
                    unfocusedBorderColor = Color(0xFF2B5852),
                    focusedTextColor = Color(0xFFF0F7F5),
                    unfocusedTextColor = Color(0xFFF0F7F5)
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.weight(1f)
            )

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = {
                    if (inputText.isNotBlank()) {
                        onSendMessage(inputText.trim())
                        inputText = ""
                    }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF2DD4BF),
                    contentColor = Color(0xFF0F2623)
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier.height(52.dp)
            ) {
                Text("পাঠান", fontWeight = FontWeight.Bold)
            }
        }
    }
}

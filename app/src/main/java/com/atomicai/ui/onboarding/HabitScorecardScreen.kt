package com.atomicai.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
fun HabitScorecardScreen(
    items: List<ScorecardItem>,
    onRatingChange: (Int, String) -> Unit,
    onNext: () -> Unit,
    onBack: () -> Unit
) {
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val ratedCount = items.count { it.rating != null }

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
                text = "ধাপ ২ অফ ৩: অভ্যাস পর্যবেক্ষণ",
                color = WisemindTeal,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Habit Scorecard",
            color = WisemindTextPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "দৈনন্দিন অভ্যাসের পাশে নির্বাচন করুন: (+) ভালো, (-) ক্ষতিকর, (=) নিউট্রাল",
            color = WisemindTextSecondary,
            fontSize = 14.sp,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        Surface(
            color = WisemindSurface,
            shape = RoundedCornerShape(12.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, WisemindBorder),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = "চিহ্নিত করা হয়েছে: $ratedCount / ${items.size}",
                color = WisemindTextPrimary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(12.dp),
                textAlign = TextAlign.Center
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(items) { item ->
                Surface(
                    color = when (item.rating) {
                        "+" -> Color(0xFF123A33)
                        "-" -> Color(0xFF2A2B20)
                        "=" -> Color(0xFF1C2C29)
                        else -> WisemindSurface
                    },
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        when (item.rating) {
                            "+" -> Color(0xFF10B981)
                            "-" -> Color(0xFFF59E0B)
                            "=" -> Color(0xFFCBD5E1)
                            else -> WisemindBorder
                        }
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "${item.id}. ${item.title}",
                            color = WisemindTextPrimary,
                            fontSize = 14.sp,
                            modifier = Modifier.weight(1f)
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            listOf("+", "-", "=").forEach { rating ->
                                val isSelected = item.rating == rating
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(
                                            if (isSelected) WisemindTeal else Color(0xFF0F2623),
                                            RoundedCornerShape(8.dp)
                                        )
                                        .border(1.dp, WisemindBorder, RoundedCornerShape(8.dp))
                                        .clickable { onRatingChange(item.id, rating) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = rating,
                                        color = if (isSelected) WisemindBg else WisemindTextPrimary,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp
                                    )
                                }
                            }
                        }
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
                    if (ratedCount < 5) {
                        errorMessage = "কমপক্ষে ৫টি অভ্যাসে ক্লিক করে চিহ্নিত করুন"
                    } else {
                        onNext()
                    }
                },
                modifier = Modifier
                    .weight(2f)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(containerColor = WisemindTeal),
                shape = RoundedCornerShape(14.dp)
            ) {
                Text("পরবর্তী ধাপ →", color = WisemindBg, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

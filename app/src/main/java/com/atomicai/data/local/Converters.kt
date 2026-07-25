package com.atomicai.data.local

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.atomicai.data.model.Message

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromStringList(value: List<String>?): String {
        return gson.toJson(value ?: emptyList<String>())
    }

    @TypeConverter
    fun toStringList(value: String?): List<String> {
        if (value.isNullOrEmpty()) return emptyList()
        val listType = object : TypeToken<List<String>>() {}.type
        return gson.fromJson(value, listType)
    }

    @TypeConverter
    fun fromMessageList(value: List<Message>?): String {
        return gson.toJson(value ?: emptyList<Message>())
    }

    @TypeConverter
    fun toMessageList(value: String?): List<Message> {
        if (value.isNullOrEmpty()) return emptyList()
        val listType = object : TypeToken<List<Message>>() {}.type
        return gson.fromJson(value, listType)
    }
}

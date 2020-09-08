package com.example.android.diceroller

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import java.util.*

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val rollButton: Button = findViewById(R.id.roll_button);
        rollButton.setOnClickListener{rollDice()}
    }

    private fun rollDice() {
        val resultText: TextView = findViewById(R.id.result_text)
        val result = (Random().nextInt(6)+ 1).toString()
        resultText.text = result
    }
}
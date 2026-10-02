// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by scripts/build-adapters.mjs from tokens.json.
// Edit tokens.json, then run: npm run tokens:build
// This file is checked for staleness by: npm run adapters:check
// Source of truth: tokens.json
package com.dammieoptimus.brand

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/**
 * Raw palette. Referenced only by the colour schemes below.
 * No screen should ever import this.
 */
internal object Palette {
    val Amber400 = Color(0xFFFBBF24)
    val Amber500 = Color(0xFFF59E0B)
    val Amber700 = Color(0xFFB45309)
    val Cyan400 = Color(0xFF22D3EE)
    val Cyan500 = Color(0xFF06B6D4)
    val Cyan700 = Color(0xFF0E7490)
    val Emerald400 = Color(0xFF34D399)
    val Emerald500 = Color(0xFF10B981)
    val Emerald700 = Color(0xFF047857)
    val Paper = Color(0xFFEAEFF5)
    val Rose400 = Color(0xFFFB7185)
    val Rose500 = Color(0xFFF43F5E)
    val Rose700 = Color(0xFFE11D48)
    val Slate100 = Color(0xFFF1F5F9)
    val Slate300 = Color(0xFFCBD5E1)
    val Slate400 = Color(0xFF94A3B8)
    val Slate50 = Color(0xFFF8FAFC)
    val Slate700 = Color(0xFF334155)
    val Slate800 = Color(0xFF1E293B)
    val Slate900 = Color(0xFF0F172A)
    val Slate950 = Color(0xFF020617)
}

private val DarkColors = darkColorScheme(
    primary = Color(0xFF10B981),
    onPrimary = Color(0xFF020617),
    secondary = Color(0xFF06B6D4),
    onSecondary = Color(0xFF020617),
    background = Color(0xFF020617),
    onBackground = Color(0xFFF1F5F9),
    surface = Color(0xFF0F172A),
    onSurface = Color(0xFFF1F5F9),
    surfaceVariant = Color(0xFF1E293B),
    onSurfaceVariant = Color(0xFF94A3B8),
    surfaceContainer = Color(0xFF0F172A),
    surfaceContainerHigh = Color(0xFF1E293B),
    outline = Color(0xFF1E293B),
    outlineVariant = Color(0xFF334155),
    error = Color(0xFFF43F5E),
    onError = Color(0xFFFB7185),
)

private val LightColors = lightColorScheme(
    primary = Color(0xFF047857),
    onPrimary = Color(0xFF020617),
    secondary = Color(0xFF0E7490),
    onSecondary = Color(0xFF020617),
    background = Color(0xFFEAEFF5),
    onBackground = Color(0xFF020617),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF020617),
    surfaceVariant = Color(0xFFF8FAFC),
    onSurfaceVariant = Color(0xFF556070),
    surfaceContainer = Color(0xFFFFFFFF),
    surfaceContainerHigh = Color(0xFFF8FAFC),
    outline = Color(0xFFCBD5E1),
    outlineVariant = Color(0xFF94A3B8),
    error = Color(0xFFE11D48),
    onError = Color(0xFFE11D48),
)

/** Four radii, no invention between them. */
private val BrandShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small      = RoundedCornerShape(8.dp),
    medium     = RoundedCornerShape(11.dp),
    large      = RoundedCornerShape(16.dp),
    extraLarge = RoundedCornerShape(16.dp),
)

/**
 * Type roles mapped onto Material typography.
 *
 * Line heights are generous by design — that is the brand, not an oversight.
 * Letter spacing is in em so it stays proportional if the scale changes.
 * Never replace these with a hardcoded sp value in a screen.
 */
private val BrandTypography = Typography(
    displayLarge = TextStyle(fontSize = 48.sp, lineHeight = 57.6.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.02).em),
    headlineMedium = TextStyle(fontSize = 32.sp, lineHeight = 38.4.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = (-0.02).em),
    titleLarge = TextStyle(fontSize = 22.sp, lineHeight = 28.6.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.015).em),
    bodyLarge = TextStyle(fontSize = 16.sp, lineHeight = 25.6.sp, fontWeight = FontWeight.Normal),
    bodyMedium = TextStyle(fontSize = 15.sp, lineHeight = 25.5.sp, fontWeight = FontWeight.Normal),
    labelLarge = TextStyle(fontSize = 13.sp, lineHeight = 19.5.sp, fontWeight = FontWeight.SemiBold),
    bodySmall = TextStyle(fontSize = 12.sp, lineHeight = 18.sp, fontWeight = FontWeight.Medium),
    labelSmall = TextStyle(fontSize = 11.sp, lineHeight = 15.4.sp, fontWeight = FontWeight.ExtraBold),
)

/** Dimensions. Spacing in dp, type in sp — never the other way round. */
object Dimm {
    val Xxxs = 2.dp
    val Xxs = 4.dp
    val Xs = 8.dp
    val Sm = 12.dp
    val Md = 16.dp
    val Lg = 24.dp
    val Xl = 32.dp
    val Xxl = 48.dp
    val Xxxl = 64.dp

    val radiusChip    = 8.dp
    val radiusControl = 11.dp
    val radiusCard    = 16.dp

    // Hit area, not visual size. Pad to reach it, never shrink below it.
    val touchTarget = 48.dp
    val touchGap    = 8.dp

    val borderWidth = 1.5.dp

    val motionFast   = 150
    val motionNormal = 250
}

/**
 * Apply once, at the top of the tree.
 *
 * darkTheme follows the system by default. Do not force it: the brand is
 * dark-native, which is unusually well suited to phones, so following the
 * user gets the benefit without doing anything.
 *
 * Do NOT swap this for dynamicLightColorScheme / dynamicDarkColorScheme.
 * Android 12+ can derive a whole palette from the user wallpaper, which
 * silently overrides the brand with no error and no crash. It also looks
 * correct on the developer device and wrong on everyone else's, because it
 * depends on which wallpaper they happen to have. A brand that varies per
 * user is not a brand. If you need a wallpaper accent, reference it
 * explicitly as a deliberate role, never as the scheme.
 */
@Composable
fun DammieTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) = MaterialTheme(
    colorScheme = if (darkTheme) DarkColors else LightColors,
    shapes = BrandShapes,
    typography = BrandTypography,
    content = content,
)